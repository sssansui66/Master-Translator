const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
const port = 3001;

// API配置
const DEEPSEEK_API_KEY = 'sk-ab63461916ff4c86b99890b853cda6eb';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 启用CORS
app.use(cors());

// 配置静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 配置文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// 根路由处理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 处理文件上传和翻译
app.post('/translate', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有上传文件' });
        }

        // 读取Excel文件
        const workbook = XLSX.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        // 翻译数据
        const translatedData = [];
        for (const row of data) {
            if (row.title && row.content) {
                const translatedTitle = await translateText(row.title);
                const translatedContent = await translateText(row.content);
                
                translatedData.push({
                    title: translatedTitle,
                    content: translatedContent
                });
            }
        }

        // 创建新的Excel文件
        const newWorkbook = XLSX.utils.book_new();
        const newSheet = XLSX.utils.json_to_sheet(translatedData);
        XLSX.utils.book_append_sheet(newWorkbook, newSheet, "翻译结果");

        // 保存翻译后的文件
        const outputPath = path.join('uploads', `translated_${Date.now()}.xlsx`);
        XLSX.writeFile(newWorkbook, outputPath);

        // 返回文件下载链接
        res.json({
            success: true,
            downloadUrl: `/download/${path.basename(outputPath)}`
        });

    } catch (error) {
        console.error('处理文件时出错:', error);
        res.status(500).json({ error: '处理文件时出错' });
    }
});

// 文件下载路由
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath);
});

// 判断文本是否包含中文
function isChineseText(text) {
    // 使用Unicode范围检查是否包含中文字符
    const chineseRegex = /[\u4e00-\u9fa5]/;
    return chineseRegex.test(text);
}

// 判断文本是否主要是英文
function isEnglishText(text) {
    // 移除标点符号和数字，只保留字母和空格
    const cleanText = text.replace(/[^a-zA-Z\s]/g, '').trim();
    // 如果清理后的文本为空，说明没有英文字母
    if (!cleanText) return false;
    
    // 计算英文字母占比
    const englishChars = cleanText.length;
    const totalChars = text.replace(/\s/g, '').length;
    
    // 如果英文字母占比超过50%，认为是英文文本
    return englishChars / totalChars > 0.5;
}

// 翻译函数
async function translateText(text) {
    try {
        // 如果文本是空的，直接返回
        if (!text.trim()) {
            return text;
        }

        // 如果文本主要是英文，直接返回原文
        if (isEnglishText(text)) {
            console.log(`文本"${text}"判断为英文，保持原文`);
            return text;
        }

        // 如果文本不包含中文，直接返回原文
        if (!isChineseText(text)) {
            console.log(`文本"${text}"不包含中文，保持原文`);
            return text;
        }

        console.log(`文本"${text}"判断为中文，进行翻译`);
        const response = await axios.post(DEEPSEEK_API_URL, {
            model: "deepseek-chat",
            messages: [
                {
                    role: "user",
                    content: `请将以下中文文本翻译成英文，只返回翻译结果，不要加任何额外的解释：\n${text}`
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        }, {
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // 从响应中提取翻译结果
        if (response.data && response.data.choices && response.data.choices[0]) {
            return response.data.choices[0].message.content.trim();
        } else {
            throw new Error('翻译API返回格式错误');
        }
    } catch (error) {
        console.error('翻译API调用失败:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// 创建必要的目录
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
}); 