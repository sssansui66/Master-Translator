# Master-Translator

一个基于DeepSeek API的专业Excel文件翻译工具，支持中英文智能识别和翻译。

## 主要特性

- 🚀 自动识别中英文内容
- 📊 支持Excel文件批量处理
- 🔄 智能保留英文内容不翻译
- 💡 专业的翻译质量
- 🎯 支持.xlsx和.xls格式
- 📝 保持原文格式和结构
- 🖥️ 简洁易用的Web界面
- 📤 支持文件拖拽上传
- 📈 实时显示处理进度

## 技术栈

- 前端：HTML5, CSS3, JavaScript
- 后端：Node.js, Express
- 文件处理：Multer, XLSX
- API集成：DeepSeek API
- 跨域处理：CORS

## 快速开始

### 前置要求

- Node.js >= 14.0.0
- NPM >= 6.0.0
- DeepSeek API Key

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/sssansui66/Master-Translator.git
cd Master-Translator
```

2. 安装依赖
```bash
npm install
```

3. 配置环境
- 打开`server.js`文件
- 设置你的DeepSeek API Key
```javascript
const DEEPSEEK_API_KEY = 'your-api-key';
```

4. 启动服务
```bash
npm start
```

5. 访问应用
打开浏览器访问 http://localhost:3001

## 使用说明

1. 准备Excel文件
   - 确保文件包含`title`和`content`列
   - 支持.xlsx和.xls格式

2. 上传文件
   - 点击上传区域选择文件
   - 或直接拖拽文件到上传区域

3. 处理文件
   - 点击"开始处理"按钮
   - 等待处理完成
   - 下载翻译结果

## 翻译规则

- 自动识别文本语言类型
- 英文内容保持原文不变
- 中文内容翻译成英文
- 保持专业术语准确性
- 保留原文格式和结构

## 注意事项

1. 文件要求
   - 必须包含title和content列
   - 文件大小限制：10MB
   - 支持格式：.xlsx, .xls

2. 网络要求
   - 确保网络连接稳定
   - 需要能访问DeepSeek API

3. 性能考虑
   - 大文件处理可能需要较长时间
   - 建议分批处理大量数据

## 开发计划

- [ ] 支持更多文件格式
- [ ] 添加更多语言支持
- [ ] 优化翻译质量
- [ ] 添加批量处理功能
- [ ] 支持自定义列名
- [ ] 添加用户认证功能

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License 