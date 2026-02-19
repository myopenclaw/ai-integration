# 🤖 AI Integration Module - Flexible Vision AI Analyzer

## 🚀 Overview
**AI Integration Module** is a flexible, pluggable AI analysis system for image processing. It supports multiple AI providers (mock, OpenAI Vision, Google Cloud Vision) with a unified API interface. Perfect for integrating AI capabilities into any application.

## ✨ Features

### ✅ **Core Features**
- **Multi-Provider Support** - Mock, OpenAI, Google Cloud, Custom
- **Unified API Interface** - Same interface for all providers
- **Easy Configuration** - Simple JSON configuration
- **Fallback Mechanisms** - Automatic provider fallback
- **Batch Processing** - Process multiple images at once
- **Result Caching** - Cache AI responses for performance
- **Extensible Architecture** - Easy to add new providers
- **Comprehensive Logging** - Detailed analysis logs

### 🔌 **Supported AI Providers**
| Provider | Mode | Features | Cost |
|----------|------|----------|------|
| **Mock** | Local | Simulated responses | Free |
| **OpenAI Vision** | Cloud | GPT-4 Vision, detailed analysis | Paid |
| **Google Cloud Vision** | Cloud | Label detection, OCR, safe search | Paid |
| **Custom** | Any | Connect your own AI models | Variable |

## 🎯 Quick Start

### 1. Installation
```bash
# Clone repository
git clone https://github.com/yourusername/ai-integration.git
cd ai-integration

# Install dependencies
npm install
```

### 2. Configuration
Create `ai-config.json`:
```json
{
  "mode": "mock",
  "providers": {
    "mock": {
      "enabled": true,
      "responseDelay": 100
    },
    "openai": {
      "enabled": false,
      "apiKey": "your-openai-api-key",
      "model": "gpt-4-vision-preview",
      "maxTokens": 300
    },
    "google": {
      "enabled": false,
      "apiKey": "your-google-api-key",
      "projectId": "your-project-id"
    }
  },
  "cache": {
    "enabled": true,
    "ttl": 3600000
  }
}
```

### 3. Basic Usage
```javascript
const AIAnalyzer = require('./ai-integration-module.js');

// Initialize analyzer
const analyzer = new AIAnalyzer();

// Analyze an image
const result = await analyzer.analyzeImage({
  imagePath: '/path/to/image.jpg',
  analysisType: 'describe',
  options: {
    detail: 'high',
    maxTokens: 150
  }
});

console.log('Analysis result:', result);
```

### 4. CLI Usage
```bash
# Setup configuration
node ai-integration-setup.js

# Test with mock provider
node ai-integration-module.js --test --mode=mock

# Test with OpenAI (requires API key)
node ai-integration-module.js --test --mode=openai --image=test.jpg

# Batch process images
node ai-integration-module.js --batch --folder=./images --mode=google
```

## 🔧 Configuration

### **Configuration File (`ai-config.json`):**
```json
{
  "mode": "mock",
  "defaultProvider": "mock",
  "fallbackChain": ["openai", "google", "mock"],
  "providers": {
    "mock": {
      "enabled": true,
      "responseDelay": 100,
      "simulatedResponses": {
        "describe": "This is a simulated image description.",
        "tags": ["simulated", "test", "image"],
        "moderate": { "safe": true, "categories": {} }
      }
    },
    "openai": {
      "enabled": false,
      "apiKey": "",
      "model": "gpt-4-vision-preview",
      "maxTokens": 300,
      "temperature": 0.7,
      "detail": "auto"
    },
    "google": {
      "enabled": false,
      "apiKey": "",
      "projectId": "",
      "features": ["LABEL_DETECTION", "TEXT_DETECTION", "SAFE_SEARCH_DETECTION"]
    }
  },
  "cache": {
    "enabled": true,
    "ttl": 3600000,
    "maxSize": 1000
  },
  "logging": {
    "level": "info",
    "file": "./ai-analysis.log"
  }
}
```

### **Environment Variables:**
```bash
AI_MODE=mock                          # mock, openai, google, custom
OPENAI_API_KEY=your-key-here          # OpenAI API key
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
AI_CACHE_ENABLED=true
AI_LOG_LEVEL=info
```

## 🔌 API Reference

### **AIAnalyzer Class**

#### `constructor(config = {})`
Create a new AI analyzer instance.

**Parameters:**
- `config` - Configuration object (optional)

**Example:**
```javascript
const analyzer = new AIAnalyzer({
  mode: 'mock',
  cache: { enabled: true, ttl: 3600000 }
});
```

#### `analyzeImage(options)`
Analyze a single image.

**Parameters:**
```javascript
{
  imagePath: '/path/to/image.jpg',    // Local file path
  imageUrl: 'https://example.com/image.jpg',  // OR URL
  imageBuffer: buffer,                // OR Buffer
  analysisType: 'describe',           // describe, tags, moderate, extract_text
  options: {                          // Analysis-specific options
    detail: 'high',                   // Image detail level
    maxTokens: 150,                   // Max response tokens
    language: 'en'                    // Response language
  },
  provider: 'auto'                    // Specific provider or 'auto'
}
```

**Returns:**
```javascript
{
  success: true,
  provider: 'mock',
  analysisType: 'describe',
  result: 'This image shows...',
  processingTime: 125,
  cached: false,
  timestamp: '2026-02-19T10:30:00.000Z'
}
```

#### `analyzeImagesBatch(images, options)`
Analyze multiple images in batch.

**Parameters:**
- `images` - Array of image analysis requests
- `options` - Batch options (parallel, timeout, etc.)

**Example:**
```javascript
const results = await analyzer.analyzeImagesBatch([
  { imagePath: 'image1.jpg', analysisType: 'describe' },
  { imagePath: 'image2.jpg', analysisType: 'tags' },
  { imagePath: 'image3.jpg', analysisType: 'moderate' }
], {
  parallel: 3,
  timeout: 30000
});
```

#### `getSupportedAnalysisTypes()`
Get list of supported analysis types for current provider.

#### `getProviderStatus()`
Get status of all configured providers.

#### `clearCache()`
Clear the analysis cache.

### **Analysis Types**

#### **1. Describe**
Get a detailed description of the image.

**Options:**
- `detail` - Detail level (low, high, auto)
- `maxTokens` - Maximum tokens in response
- `style` - Description style (technical, creative, simple)

**Example Result:**
```json
{
  "description": "A beautiful sunset over mountains with orange and purple clouds...",
  "mainSubjects": ["mountains", "sunset", "clouds"],
  "colors": ["orange", "purple", "blue"],
  "mood": "peaceful, serene"
}
```

#### **2. Tags**
Extract relevant tags and labels from the image.

**Options:**
- `maxTags` - Maximum number of tags
- `confidenceThreshold` - Minimum confidence score
- `categories` - Filter by categories

**Example Result:**
```json
{
  "tags": [
    {"tag": "mountain", "confidence": 0.95, "category": "landscape"},
    {"tag": "sunset", "confidence": 0.92, "category": "sky"},
    {"tag": "clouds", "confidence": 0.88, "category": "weather"}
  ],
  "dominantColors": ["#FF6B35", "#004E89"],
  "estimatedLocation": "mountain region"
}
```

#### **3. Moderate**
Check image for inappropriate content.

**Options:**
- `categories` - Specific categories to check

**Example Result:**
```json
{
  "safe": true,
  "categories": {
    "adult": {"likely": false, "confidence": 0.02},
    "violence": {"likely": false, "confidence": 0.01},
    "racy": {"likely": false, "confidence": 0.03}
  },
  "overallScore": 0.98,
  "recommendation": "safe"
}
```

#### **4. Extract Text**
Extract text from the image (OCR).

**Options:**
- `language` - Language hint for OCR
- `detailed` - Include character positions

**Example Result:**
```json
{
  "text": "Welcome to OpenClaw AI Ecosystem",
  "language": "en",
  "confidence": 0.89,
  "lines": [
    {"text": "Welcome to", "confidence": 0.92},
    {"text": "OpenClaw AI Ecosystem", "confidence": 0.89}
  ]
}
```

## 🚀 Integration Examples

### **Express.js Integration:**
```javascript
const express = require('express');
const AIAnalyzer = require('./ai-integration-module.js');

const app = express();
const analyzer = new AIAnalyzer();

app.post('/api/analyze', async (req, res) => {
  try {
    const { imageUrl, analysisType, options } = req.body;
    
    const result = await analyzer.analyzeImage({
      imageUrl,
      analysisType,
      options
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('AI Analysis API running on port 3000');
});
```

### **Super Product Integration:**
```javascript
// In Super Product platform
const AIAnalyzer = require('./ai-integration-module.js');

class ImageAnalysisService {
  constructor() {
    this.analyzer = new AIAnalyzer();
  }
  
  async analyzeUploadedImage(imageId, imagePath) {
    // Get description
    const description = await this.analyzer.analyzeImage({
      imagePath,
      analysisType: 'describe'
    });
    
    // Get tags
    const tags = await this.analyzer.analyzeImage({
      imagePath,
      analysisType: 'tags'
    });
    
    // Moderate content
    const moderation = await this.analyzer.analyzeImage({
      imagePath,
      analysisType: 'moderate'
    });
    
    return {
      imageId,
      description: description.result,
      tags: tags.result.tags,
      safe: moderation.result.safe,
      analysisDate: new Date().toISOString()
    };
  }
}
```

### **Batch Processing Service:**
```javascript
const AIAnalyzer = require('./ai-integration-module.js');
const fs = require('fs').promises;
const path = require('path');

class BatchProcessor {
  constructor() {
    this.analyzer = new AIAnalyzer();
  }
  
  async processFolder(folderPath, analysisType = 'describe') {
    const files = await fs.readdir(folderPath);
    const imageFiles = files.filter(f => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
    );
    
    const results = await this.analyzer.analyzeImagesBatch(
      imageFiles.map(file => ({
        imagePath: path.join(folderPath, file),
        analysisType
      })),
      { parallel: 5, timeout: 60000 }
    );
    
    // Save results
    await fs.writeFile(
      path.join(folderPath, 'analysis-results.json'),
      JSON.stringify(results, null, 2)
    );
    
    return results;
  }
}
```

## 📊 Performance & Caching

### **Caching Strategy:**
- **Memory Cache:** In-memory cache for frequent requests
- **TTL Configuration:** Configurable time-to-live
- **Cache Key:** Based on image hash + analysis type + options
- **Cache Invalidation:** Manual or automatic based on TTL

### **Performance Optimization:**
- **Parallel Processing:** Multiple images simultaneously
- **Request Batching:** Batch API calls where supported
- **Connection Pooling:** Reuse HTTP connections
- **Result Compression:** Compress large responses

### **Monitoring:**
```javascript
// Get performance metrics
const metrics = analyzer.getPerformanceMetrics();
console.log(metrics);
/*
{
  totalRequests: 150,
  successfulRequests: 148,
  failedRequests: 2,
  averageResponseTime: 2450,
  cacheHitRate: 0.65,
  providerUsage: {
    mock: 45,
    openai: 85,
    google: 20
  }
}
*/
```

## 🔧 Provider Implementation

### **Adding a New Provider:**
```javascript
// custom-provider.js
class CustomAIProvider {
  constructor(config) {
    this.name = 'custom';
    this.config = config;
  }
  
  async analyze(imageData, analysisType, options) {
    // Implement your AI analysis logic
    // imageData can be Buffer, file path, or URL
    
    return {
      success: true,
      result: 'Custom analysis result',
      processingTime: Date.now() - startTime
    };
  }
  
  getSupportedAnalysisTypes() {
    return ['describe', 'tags', 'moderate', 'extract_text'];
  }
  
  isAvailable() {
    return true; // Check if provider is available
  }
}

// Register provider
const analyzer = new AIAnalyzer();
analyzer.registerProvider('custom', CustomAIProvider);
```

### **Provider Fallback Chain:**
The module automatically falls back through providers:
1. Primary provider (configured in `mode`)
2. Fallback providers (in order from `fallbackChain`)
3. Mock provider (always available)

## 🛠️ Development

### **Project Structure:**
```
ai-integration/
├── ai-integration-module.js      # Main module
├── ai-integration-setup.js       # Configuration CLI
├── ai-config.json                # Configuration template
├── package.json                  # Dependencies
├── README.md                     # This file
├── providers/                    # AI provider implementations
│   ├── mock-provider.js
│   ├── openai-provider.js
│   ├── google-provider.js
│   └── base-provider.js
├── utils/                        # Utilities
│   ├── cache-manager.js
│   ├── image-processor.js
│   └── logger.js
├── examples/                     # Example code
│   ├── express-integration.js
│   ├── batch-processing.js
│   └── custom-provider.js
└── tests/                        # Test suite
    ├── unit-tests.js
    ├── integration-tests.js
    └── performance-tests.js
```

### **Development Scripts:**
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run specific provider tests
npm test:mock
npm test:openai
npm test:google

# Run performance tests
npm run test:performance

# Generate documentation
npm run docs

# Lint code
npm run lint
```

## 📈 Use Cases

### **Content Moderation:**
- Automatically filter inappropriate images
- Flag potentially harmful content
- Ensure platform safety and compliance

### **Image Organization:**
- Auto-tag images for search
- Categorize image libraries
- Generate alt text for accessibility

### **E-commerce:**
- Product image analysis
- Extract product details from images
- Generate product descriptions

### **Social Media:**
- Analyze user-uploaded content
- Generate captions for images
- Detect trending visual content

### **Research & Analysis:**
- Scientific image analysis
- Document processing with OCR
- Visual data extraction

## 🔒 Security & Compliance

### **Data Privacy:**
- **Local Processing:** Mock provider processes locally
- **API Key Management:** Secure API key storage
- **Data Minimization:** Only send necessary data to cloud providers
- **Compliance:** Configurable for GDPR, HIPAA, etc.

### **Error Handling:**
- **Graceful Degradation:** Fallback to mock provider on failure
- **Retry Logic:** Configurable retry attempts
- **Circuit Breaker:** Prevent cascading failures
- **Detailed Logging:** Audit trail for all analyses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 📞 Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/yourusername/ai-integration/issues)
- **Documentation:** Full documentation included
- **Examples:** See `/examples` directory

## 🔗 Links

- **GitHub Repository:** https://github.com/yourusername/ai-integration
- **OpenAI Vision API:** https://platform.openai.com/docs/guides/vision
- **Google Cloud Vision:** https://cloud.google.com/vision
- **Integration Examples:** Included in `/examples` directory

---

**Built with ❤️ by OpenClaw AI Ecosystem | 2026-02-19**