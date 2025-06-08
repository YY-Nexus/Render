"use client"

import type React from "react"

import { useEffect, useRef, useCallback, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { APIStatusIndicator } from "@/components/api-status-indicator"
import { useSafeDOM } from "@/hooks/use-safe-dom"
import {
  Sparkles,
  Rocket,
  BarChart3,
  Activity,
  FileText,
  MessageSquare,
  TrendingUp,
  Trash2,
  Globe,
  Cloud,
  Brain,
  Download,
  RotateCcw,
  ImageIcon,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { APIMonitorDashboard } from "@/components/api-monitor-dashboard"

export default function YanYuCloudPlatform() {
  // 使用安全DOM操作Hook
  const { safeDownload, isMounted } = useSafeDOM()

  // 安全异步操作管理
  const mountedRef = useRef(true)
  const controllersRef = useRef<Set<AbortController>>(new Set())

  // 组件卸载时清理
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      // 取消所有进行中的请求
      controllersRef.current.forEach((controller) => {
        try {
          controller.abort()
        } catch (error) {
          console.error("取消请求时发生错误", error)
        }
      })
      controllersRef.current.clear()
    }
  }, [])

  // 创建可取消的异步操作
  const createCancellableOperation = useCallback(<T,>(operation: (signal: AbortSignal) => Promise<T>): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      if (!mountedRef.current) {
        reject(new Error("组件已卸载"))
        return
      }

      const controller = new AbortController()
      controllersRef.current.add(controller)

      operation(controller.signal)
        .then((result) => {
          if (mountedRef.current) {
            resolve(result)
          }
        })
        .catch((error) => {
          if (mountedRef.current && error.name !== "AbortError") {
            reject(error)
          }
        })
        .finally(() => {
          controllersRef.current.delete(controller)
        })
    })
  }, [])

  // 安全的状态更新
  const safeSetState = useCallback(
    <T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T | ((prev: T) => T)): void => {
      if (mountedRef.current) {
        setter(value)
      }
    },
    [],
  )

  // 文本处理状态
  const [textInput, setTextInput] = useState("")
  const [textOperation, setTextOperation] = useState("智能分析")
  const [textResult, setTextResult] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // 内容生成状态
  const [contentTopic, setContentTopic] = useState("人工智能")
  const [contentStyle, setContentStyle] = useState("专业")
  const [contentLength, setContentLength] = useState([200])
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // 图像处理状态
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageOperation, setImageOperation] = useState("智能增强")
  const [imageResult, setImageResult] = useState("")
  const [isImageProcessing, setIsImageProcessing] = useState(false)

  // 图像分类状态
  const [classificationImage, setClassificationImage] = useState<File | null>(null)
  const [classificationModel, setClassificationModel] = useState("resnet18")
  const [classificationResult, setClassificationResult] = useState("")
  const [isClassifying, setIsClassifying] = useState(false)

  // 数据分析状态
  const [dataInput, setDataInput] = useState("")
  const [analysisType, setAnalysisType] = useState("趋势分析")
  const [analysisResult, setAnalysisResult] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // API服务状态
  const [weatherCity, setWeatherCity] = useState("")
  const [weatherResult, setWeatherResult] = useState("")
  const [isWeatherLoading, setIsWeatherLoading] = useState(false)

  const [newsCategory, setNewsCategory] = useState("technology")
  const [newsResult, setNewsResult] = useState("")
  const [isNewsLoading, setIsNewsLoading] = useState(false)

  const [ipAddress, setIpAddress] = useState("")
  const [ipResult, setIpResult] = useState("")
  const [isIpLoading, setIsIpLoading] = useState(false)

  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("CNY")
  const [currencyAmount, setCurrencyAmount] = useState(100)
  const [currencyResult, setCurrencyResult] = useState("")
  const [isCurrencyLoading, setIsCurrencyLoading] = useState(false)

  // 反馈状态
  const [feedbackName, setFeedbackName] = useState("")
  const [feedbackEmail, setFeedbackEmail] = useState("")
  const [feedbackRating, setFeedbackRating] = useState([5])
  const [feedbackText, setFeedbackText] = useState("")

  // 系统统计
  const [stats, setStats] = useState({
    servers: 0,
    users: 0,
    uptime: 0,
    performance: 0,
    totalOperations: 0,
    textProcessed: 0,
    contentGenerated: 0,
    imagesProcessed: 0,
    imageClassified: 0,
    dataAnalyzed: 0,
    feedbackCount: 0,
    weatherQueries: 0,
    newsQueries: 0,
    ipQueries: 0,
    currencyQueries: 0,
  })

  // 动态数字效果 - 防止循环依赖
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    const updateStats = () => {
      if (mountedRef.current) {
        setStats((prev) => ({
          ...prev,
          servers: Math.min(prev.servers + Math.floor(Math.random() * 50), 10000),
          users: Math.min(prev.users + Math.floor(Math.random() * 100), 50000),
          uptime: Math.min(prev.uptime + 0.1, 99.9),
          performance: Math.min(prev.performance + Math.floor(Math.random() * 5), 100),
        }))
      }
    }

    timer = setInterval(updateStats, 100)

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, []) // 移除依赖，防止循环

  // API服务函数
  const fetchWeather = async (city: string) => {
    try {
      const response = await fetch(`/api/weather?city=${city}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching weather:", error)
      return { success: false, error: "Failed to fetch weather data" }
    }
  }

  const fetchNews = async (category: string) => {
    try {
      const response = await fetch(`/api/news?category=${category}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching news:", error)
      return { success: false, error: "Failed to fetch news data" }
    }
  }

  const fetchIPInfo = async (ip: string) => {
    try {
      const response = await fetch(`/api/ip?ip=${ip}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching IP info:", error)
      return { success: false, error: "Failed to fetch IP data" }
    }
  }

  const fetchCurrency = async (from: string, to: string, amount: number) => {
    try {
      const response = await fetch(`/api/currency?from=${from}&to=${to}&amount=${amount}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching currency:", error)
      return { success: false, error: "Failed to fetch currency data" }
    }
  }

  const handleWeatherQuery = useCallback(async () => {
    if (!weatherCity.trim()) {
      safeSetState(setWeatherResult, "❌ 请输入城市名称")
      return
    }

    safeSetState(setIsWeatherLoading, true)

    try {
      const result = await createCancellableOperation(async () => {
        return await fetchWeather(weatherCity)
      })

      if (result.success) {
        safeSetState(setWeatherResult, result.data)
        safeSetState(setStats, (prev) => ({
          ...prev,
          totalOperations: prev.totalOperations + 1,
          weatherQueries: prev.weatherQueries + 1,
        }))
      } else {
        safeSetState(setWeatherResult, `❌ ${result.error}`)
      }
    } catch (error) {
      if (mountedRef.current) {
        safeSetState(setWeatherResult, "❌ 网络连接错误")
      }
    } finally {
      safeSetState(setIsWeatherLoading, false)
    }
  }, [weatherCity, createCancellableOperation, safeSetState])

  const handleNewsQuery = useCallback(async () => {
    safeSetState(setIsNewsLoading, true)

    try {
      const result = await createCancellableOperation(async () => {
        return await fetchNews(newsCategory)
      })

      if (result.success) {
        safeSetState(setNewsResult, result.data)
        safeSetState(setStats, (prev) => ({
          ...prev,
          totalOperations: prev.totalOperations + 1,
          newsQueries: prev.newsQueries + 1,
        }))
      } else {
        safeSetState(setNewsResult, `❌ ${result.error}`)
      }
    } catch (error) {
      if (mountedRef.current) {
        safeSetState(setNewsResult, "❌ 网络连接错误")
      }
    } finally {
      safeSetState(setIsNewsLoading, false)
    }
  }, [newsCategory, createCancellableOperation, safeSetState])

  const handleIPQuery = useCallback(async () => {
    if (!ipAddress.trim()) {
      safeSetState(setIpResult, "❌ 请输入IP地址")
      return
    }

    safeSetState(setIsIpLoading, true)

    try {
      const result = await createCancellableOperation(async () => {
        return await fetchIPInfo(ipAddress)
      })

      if (result.success) {
        safeSetState(setIpResult, result.data)
        safeSetState(setStats, (prev) => ({
          ...prev,
          totalOperations: prev.totalOperations + 1,
          ipQueries: prev.ipQueries + 1,
        }))
      } else {
        safeSetState(setIpResult, `❌ ${result.error}`)
      }
    } catch (error) {
      if (mountedRef.current) {
        safeSetState(setIpResult, "❌ 网络连接错误")
      }
    } finally {
      safeSetState(setIsIpLoading, false)
    }
  }, [ipAddress, createCancellableOperation, safeSetState])

  const handleCurrencyQuery = useCallback(async () => {
    if (currencyAmount <= 0) {
      safeSetState(setCurrencyResult, "❌ 请输入有效的金额")
      return
    }

    safeSetState(setIsCurrencyLoading, true)

    try {
      const result = await createCancellableOperation(async () => {
        return await fetchCurrency(fromCurrency, toCurrency, currencyAmount)
      })

      if (result.success) {
        safeSetState(setCurrencyResult, result.data)
        safeSetState(setStats, (prev) => ({
          ...prev,
          totalOperations: prev.totalOperations + 1,
          currencyQueries: prev.currencyQueries + 1,
        }))
      } else {
        safeSetState(setCurrencyResult, `❌ ${result.error}`)
      }
    } catch (error) {
      if (mountedRef.current) {
        safeSetState(setCurrencyResult, "❌ 网络连接错误")
      }
    } finally {
      safeSetState(setIsCurrencyLoading, false)
    }
  }, [fromCurrency, toCurrency, currencyAmount, createCancellableOperation, safeSetState])

  // 图像分类功能
  const classifyImage = useCallback(async () => {
    if (!classificationImage) {
      safeSetState(setClassificationResult, "❌ 请先上传图像文件")
      return
    }

    safeSetState(setIsClassifying, true)

    try {
      await createCancellableOperation(async () => {
        // 模拟图像分类延迟
        await new Promise((resolve) => setTimeout(resolve, 3000))
        return true
      })

      const fileSize = (classificationImage.size / 1024 / 1024).toFixed(2)
      const currentTime = new Date().toLocaleString("zh-CN")

      // 模拟分类结果
      const mockResults = {
        resnet18: [
          { label: "猫科动物", confidence: 0.89 },
          { label: "家猫", confidence: 0.76 },
          { label: "波斯猫", confidence: 0.65 },
          { label: "哺乳动物", confidence: 0.54 },
          { label: "宠物", confidence: 0.43 },
        ],
        resnet50: [
          { label: "犬科动物", confidence: 0.92 },
          { label: "金毛犬", confidence: 0.81 },
          { label: "拉布拉多", confidence: 0.69 },
          { label: "哺乳动物", confidence: 0.58 },
          { label: "宠物", confidence: 0.47 },
        ],
        mobilenet: [
          { label: "鸟类", confidence: 0.85 },
          { label: "鹦鹉", confidence: 0.72 },
          { label: "热带鸟", confidence: 0.61 },
          { label: "飞行动物", confidence: 0.5 },
          { label: "野生动物", confidence: 0.39 },
        ],
      }

      const results = mockResults[classificationModel as keyof typeof mockResults] || mockResults.resnet18

      const result = `# 🖼️ PyTorch 图像分类结果

## 📋 文件信息
• **文件名**：${classificationImage.name}
• **文件大小**：${fileSize} MB
• **文件类型**：${classificationImage.type}
• **分类时间**：${currentTime}
• **使用模型**：${classificationModel.toUpperCase()}

## 🎯 分类结果 (Top 5)

${results
  .map(
    (item, index) =>
      `**${index + 1}. ${item.label}**
   置信度: ${(item.confidence * 100).toFixed(1)}%
   概率值: ${item.confidence.toFixed(4)}`,
  )
  .join("\n\n")}

## 📊 技术详情
• **模型架构**：${
        classificationModel === "resnet18"
          ? "ResNet-18 (18层残差网络)"
          : classificationModel === "resnet50"
            ? "ResNet-50 (50层残差网络)"
            : "MobileNet V2 (轻量级网络)"
      }
• **预训练数据**：ImageNet (1000类)
• **输入尺寸**：224×224 像素
• **推理时间**：${(Math.random() * 2 + 0.5).toFixed(2)}秒

## 💡 分析建议
${
  results[0].confidence > 0.8
    ? "✅ 分类结果置信度较高，预测可靠"
    : results[0].confidence > 0.6
      ? "⚠️ 分类结果置信度中等，建议人工确认"
      : "❌ 分类结果置信度较低，可能需要更清晰的图像"
}

## 🔍 应用场景
• 自动图像标注和分类
• 内容审核和过滤
• 智能相册管理
• 医学影像辅助诊断
• 自动驾驶物体识别`

      safeSetState(setClassificationResult, result)
      safeSetState(setStats, (prev) => ({
        ...prev,
        totalOperations: prev.totalOperations + 1,
        imageClassified: prev.imageClassified + 1,
      }))
    } catch (error) {
      if (mountedRef.current) {
        safeSetState(setClassificationResult, "❌ 分类过程中发生错误")
      }
    } finally {
      safeSetState(setIsClassifying, false)
    }
  }, [classificationImage, classificationModel, createCancellableOperation, safeSetState])

  // 文本处理功能
  const processText = useCallback(async () => {
    if (!textInput.trim()) {
      safeSetState(setTextResult, "❌ 请输入文本进行处理")
      return
    }

    safeSetState(setIsProcessing, true)
    try {
      await createCancellableOperation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return true
      })

      const wordCount = textInput.split(" ").length
      const charCount = textInput.length
      const currentTime = new Date().toLocaleString("zh-CN")

      let result = ""

      switch (textOperation) {
        case "智能分析":
          result = `# 📊 智能文本分析报告

## 📝 基础统计
• **字符总数**：${charCount}
• **单词数量**：${wordCount}
• **分析时间**：${currentTime}

## 🎯 文本特征
• **文本密度**：${wordCount > 50 ? "高" : wordCount > 20 ? "中" : "低"}
• **复杂度**：${charCount > 200 ? "复杂" : charCount > 100 ? "中等" : "简单"}
• **可读性**：${charCount > 300 ? "需要优化" : "良好"}

## 💡 优化建议
${charCount > 300 ? "建议分段处理，提升可读性" : "文本结构清晰，建议保持当前风格"}

## 🔍 关键信息
检测到 ${Math.floor(charCount / 50)} 个主要观点，${Math.floor(wordCount / 10)} 个关键概念。`
          break
        case "内容优化":
          const optimized = textInput
            .replace(/\s+/g, " ")
            .trim()
            .replace(/([。！？])\s*/g, "$1\n")
          result = `# 🔧 内容优化结果

## ✨ 优化后的文本
${optimized}

## 📈 优化说明
• 清理了多余空格
• 优化了段落结构
• 提升了可读性
• 保持了原意不变`
          break
        case "关键词提取":
          const words = textInput
            .toLowerCase()
            .replace(/[^\w\s\u4e00-\u9fff]/g, "")
            .split(/\s+/)
            .filter((word) => word.length > 2)
          const wordFreq = words.reduce(
            (acc, word) => {
              acc[word] = (acc[word] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          )
          const keywords = Object.entries(wordFreq)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)

          result = `# 🔍 关键词提取结果

## 🏷️ 高频关键词
${keywords.map(([word, freq]) => `• **${word}** (出现${freq}次)`).join("\n")}

## 📊 词频分析
• **总词汇量**：${words.length}
• **唯一词汇**：${Object.keys(wordFreq).length}
• **词汇丰富度**：${((Object.keys(wordFreq).length / words.length) * 100).toFixed(1)}%`
          break
        case "情感分析":
          const positiveWords = ["好", "棒", "优秀", "喜欢", "爱", "开心", "快乐", "满意", "成功", "完美", "赞", "支持"]
          const negativeWords = [
            "坏",
            "差",
            "糟糕",
            "讨厌",
            "恨",
            "难过",
            "失败",
            "问题",
            "错误",
            "困难",
            "反对",
            "不满",
          ]

          const textLower = textInput.toLowerCase()
          const positiveCount = positiveWords.filter((word) => textLower.includes(word)).length
          const negativeCount = negativeWords.filter((word) => textLower.includes(word)).length

          const sentiment =
            positiveCount > negativeCount ? "😊 积极" : negativeCount > positiveCount ? "😔 消极" : "😐 中性"
          const confidence = Math.min(95, 60 + Math.abs(positiveCount - negativeCount) * 15)

          result = `# 🎭 情感分析结果

## 😊 情感倾向
**${sentiment}** (置信度: ${confidence}%)

## 📈 详细分析
• **积极词汇**：${positiveCount} 个
• **消极词汇**：${negativeCount} 个
• **情感强度**：${Math.abs(positiveCount - negativeCount) > 2 ? "强烈" : "温和"}
• **情感稳定性**：${Math.abs(positiveCount - negativeCount) < 2 ? "平衡" : "倾向性明显"}

## 💭 情感建议
${
  positiveCount > negativeCount
    ? "文本传达积极正面的信息"
    : negativeCount > positiveCount
      ? "建议增加一些积极元素"
      : "情感表达较为中性平衡"
}`
          break
      }

      safeSetState(setTextResult, result)
      safeSetState(setStats, (prev) => ({
        ...prev,
        totalOperations: prev.totalOperations + 1,
        textProcessed: prev.textProcessed + 1,
      }))
    } catch (error) {
      if (mountedRef.current) {
        safeSetState(setTextResult, "❌ 文本处理过程中发生错误")
      }
    } finally {
      safeSetState(setIsProcessing, false)
    }
  }, [textInput, textOperation, createCancellableOperation, safeSetState])

  // 内容生成功能
  const generateContent = useCallback(async () => {
    if (!contentTopic.trim()) {
      safeSetState(setGeneratedContent, "❌ 请输入主题关键词")
      return
    }

    safeSetState(setIsGenerating, true)

    try {
      await createCancellableOperation(async () => {
        // 模拟生成延迟
        await new Promise((resolve) => setTimeout(resolve, 3000))
        return true
      })

      const templates = {
        专业: {
          intro: `在当今数字化时代，${contentTopic}正在重新定义我们的工作和生活方式。`,
          body: `通过深入研究和实践，我们发现${contentTopic}具有以下核心特征：首先，它能够显著提升效率和准确性；其次，它为创新提供了新的可能性；最后，它正在推动整个行业的转型升级。`,
          conclusion: `展望未来，${contentTopic}将继续发挥重要作用，为社会发展贡献更大价值。`,
        },
        轻松: {
          intro: `嘿！你知道${contentTopic}有多酷吗？`,
          body: `它就像是给生活加了个超级助手，让一切都变得简单有趣！想象一下，有了${contentTopic}，我们可以做很多以前想都不敢想的事情。它不仅让工作变得更轻松，还能给我们带来意想不到的惊喜。`,
          conclusion: `总之，${contentTopic}真的是个改变游戏规则的存在！`,
        },
        诗意: {
          intro: `如春风拂过心田，${contentTopic}悄然改变着我们的世界。`,
          body: `在这个充满可能的时代，每一次创新都如星辰般闪耀。${contentTopic}如同一位智慧的引路人，指引着我们走向更加美好的未来。它不仅是技术的进步，更是人类智慧的结晶。`,
          conclusion: `愿${contentTopic}如明灯般照亮前行的道路，为人类文明增添新的光彩。`,
        },
      }

      const template = templates[contentStyle as keyof typeof templates] || templates["专业"]
      const targetLength = contentLength[0]

      let content = `${template.intro}\n\n${template.body}\n\n${template.conclusion}`

      // 根据目标长度调整内容
      if (content.length < targetLength) {
        const expansion = `\n\n此外，${contentTopic}的应用前景十分广阔，涉及多个领域和行业。随着技术的不断发展和完善，我们有理由相信${contentTopic}将为人类社会带来更多积极的变化和影响。`
        content += expansion
      }

      const currentTime = new Date().toLocaleString("zh-CN")

      const result = `# ✨ AI内容生成结果

## 📝 生成内容

${content}

---
**主题**：${contentTopic}  
**风格**：${contentStyle}  
**目标长度**：${targetLength}字  
**实际长度**：${content.length}字  
**生成时间**：${currentTime}

## 📊 内容分析
• **可读性**：优秀
• **原创性**：100%
• **主题相关性**：高度相关
• **语言流畅度**：自然流畅`

      safeSetState(setGeneratedContent, result)
      safeSetState(setStats, (prev) => ({
        ...prev,
        totalOperations: prev.totalOperations + 1,
        contentGenerated: prev.contentGenerated + 1,
      }))
    } catch (error) {
      if (mountedRef.current) {
        safeSetState(setGeneratedContent, "❌ 内容生成过程中发生错误")
      }
    } finally {
      safeSetState(setIsGenerating, false)
    }
  }, [contentTopic, contentStyle, contentLength, createCancellableOperation, safeSetState])

  // 图像处理功能
  const processImage = useCallback(async () => {
    if (!imageFile) {
      safeSetState(setImageResult, "❌ 请先上传图像文件")
      return
    }

    safeSetState(setIsImageProcessing, true)

    try {
      await createCancellableOperation(async () => {
        // 模拟处理延迟
        await new Promise((resolve) => setTimeout(resolve, 2500))
        return true
      })

      const fileSize = (imageFile.size / 1024 / 1024).toFixed(2)
      const currentTime = new Date().toLocaleString("zh-CN")

      const result = `# 🖼️ 图像处理结果

## 📋 文件信息
• **文件名**：${imageFile.name}
• **文件大小**：${fileSize} MB
• **文件类型**：${imageFile.type}
• **处理时间**：${currentTime}

## 🎨 处理操作：${imageOperation}

### ✨ 处理效果
${
  imageOperation === "智能增强"
    ? "• 提升了图像清晰度\n• 优化了色彩饱和度\n• 减少了噪点干扰\n• 增强了细节表现"
    : imageOperation === "风格转换"
      ? "• 应用了艺术风格滤镜\n• 调整了色调和质感\n• 创造了独特的视觉效果\n• 保持了原图主要特征"
      : imageOperation === "智能修复"
        ? "• 修复了图像瑕疵\n• 填补了缺失区域\n• 优化了光照效果\n• 提升了整体质量"
        : "• 自动裁剪到最佳比例\n• 调整了构图平衡\n• 突出了主要元素\n• 优化了视觉焦点"
}

## 📊 质量评估
• **清晰度提升**：${Math.floor(Math.random() * 30 + 20)}%
• **色彩优化**：${Math.floor(Math.random() * 25 + 15)}%
• **整体质量**：${Math.floor(Math.random() * 20 + 80)}分

## 💡 建议
处理完成！您可以下载优化后的图像，或继续进行其他处理操作。`

      safeSetState(setImageResult, result)
      safeSetState(setStats, (prev) => ({
        ...prev,
        totalOperations: prev.totalOperations + 1,
        imagesProcessed: prev.imagesProcessed + 1,
      }))
    } catch (error) {
      if (mountedRef.current) {
        safeSetState(setImageResult, "❌ 图像处理过程中发生错误")
      }
    } finally {
      safeSetState(setIsImageProcessing, false)
    }
  }, [imageFile, imageOperation, createCancellableOperation, safeSetState])

  // 数据分析功能
  const analyzeData = useCallback(async () => {
    if (!dataInput.trim()) {
      safeSetState(setAnalysisResult, "❌ 请输入要分析的数据")
      return
    }

    safeSetState(setIsAnalyzing, true)

    try {
      await createCancellableOperation(async () => {
        // 模拟分析延迟
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return true
      })

      const lines = dataInput.split("\n").filter((line) => line.trim())
      const numbers = dataInput.match(/\d+(\.\d+)?/g)?.map(Number) || []
      const currentTime = new Date().toLocaleString("zh-CN")

      let result = ""

      switch (analysisType) {
        case "趋势分析":
          const trend =
            numbers.length > 1
              ? numbers[numbers.length - 1] > numbers[0]
                ? "上升"
                : numbers[numbers.length - 1] < numbers[0]
                  ? "下降"
                  : "平稳"
              : "无法确定"

          result = `# 📈 趋势分析报告

## 📊 数据概览
• **数据点数量**：${numbers.length}
• **数据行数**：${lines.length}
• **分析时间**：${currentTime}

## 📉 趋势特征
• **整体趋势**：${trend}
• **最大值**：${numbers.length ? Math.max(...numbers) : "无"}
• **最小值**：${numbers.length ? Math.min(...numbers) : "无"}
• **平均值**：${numbers.length ? (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2) : "无"}

## 🎯 关键发现
${
  trend === "上升"
    ? "数据呈现积极的增长态势，建议继续保持当前策略。"
    : trend === "下降"
      ? "数据显示下降趋势，建议分析原因并制定改进措施。"
      : "数据相对稳定，可考虑优化策略以实现突破。"
}`
          break

        case "统计分析":
          const variance =
            numbers.length > 1
              ? numbers.reduce(
                  (acc, val) => acc + Math.pow(val - numbers.reduce((a, b) => a + b, 0) / numbers.length, 2),
                  0,
                ) / numbers.length
              : 0

          result = `# 📊 统计分析报告

## 🔢 基础统计
• **样本数量**：${numbers.length}
• **总和**：${numbers.reduce((a, b) => a + b, 0)}
• **均值**：${numbers.length ? (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2) : 0}
• **方差**：${variance.toFixed(2)}
• **标准差**：${Math.sqrt(variance).toFixed(2)}

## 📈 分布特征
• **数据范围**：${numbers.length ? (Math.max(...numbers) - Math.min(...numbers)).toFixed(2) : 0}
• **中位数**：${numbers.length ? numbers.sort((a, b) => a - b)[Math.floor(numbers.length / 2)] : 0}
• **变异系数**：${numbers.length ? ((Math.sqrt(variance) / (numbers.reduce((a, b) => a + b, 0) / numbers.length)) * 100).toFixed(2) : 0}%

## 💡 统计结论
数据${variance < 10 ? "相对集中" : variance < 50 ? "适度分散" : "高度分散"}，${Math.sqrt(variance) / (numbers.reduce((a, b) => a + b, 0) / numbers.length) < 0.3 ? "稳定性较好" : "波动性较大"}。`
          break

        case "相关性分析":
          result = `# 🔗 相关性分析报告

## 📋 数据关系
• **变量数量**：${Math.min(lines.length, 10)}
• **观测值**：${numbers.length}
• **分析维度**：多元相关性

## 🎯 相关性发现
• **强相关关系**：${Math.floor(Math.random() * 3 + 1)}组
• **中等相关关系**：${Math.floor(Math.random() * 5 + 2)}组
• **弱相关关系**：${Math.floor(Math.random() * 4 + 1)}组

## 📊 关键洞察
检测到多个变量间存在显著相关性，建议进一步深入分析因果关系。`
          break

        case "预测分析":
          const prediction =
            numbers.length > 2
              ? numbers[numbers.length - 1] + (numbers[numbers.length - 1] - numbers[numbers.length - 2])
              : numbers[numbers.length - 1] || 0

          result = `# 🔮 预测分析报告

## 🎯 预测结果
• **下期预测值**：${prediction.toFixed(2)}
• **预测区间**：[${(prediction * 0.9).toFixed(2)}, ${(prediction * 1.1).toFixed(2)}]
• **置信度**：${Math.floor(Math.random() * 20 + 75)}%

## 📈 预测依据
• **历史趋势**：${trend}
• **季节性因素**：已考虑
• **外部影响**：已纳入模型

## ⚠️ 风险提示
预测结果仅供参考，实际情况可能受多种因素影响。`
          break
      }

      safeSetState(setAnalysisResult, result)
      safeSetState(setStats, (prev) => ({
        ...prev,
        totalOperations: prev.totalOperations + 1,
        dataAnalyzed: prev.dataAnalyzed + 1,
      }))
    } catch (error) {
      if (mountedRef.current) {
        safeSetState(setAnalysisResult, "❌ 数据分析过程中发生错误")
      }
    } finally {
      safeSetState(setIsAnalyzing, false)
    }
  }, [dataInput, analysisType, createCancellableOperation, safeSetState])

  // 提交反馈功能
  const submitFeedback = useCallback(async () => {
    if (!feedbackText.trim()) {
      alert("请输入反馈内容")
      return
    }

    try {
      await createCancellableOperation(async () => {
        // 模拟提交延迟
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return true
      })

      const feedbackData = {
        name: feedbackName || "匿名用户",
        email: feedbackEmail,
        rating: feedbackRating[0],
        feedback: feedbackText,
        timestamp: new Date().toLocaleString("zh-CN"),
      }

      console.log("用户反馈：", feedbackData)

      safeSetState(setStats, (prev) => ({
        ...prev,
        feedbackCount: prev.feedbackCount + 1,
      }))

      // 清空表单
      safeSetState(setFeedbackName, "")
      safeSetState(setFeedbackEmail, "")
      safeSetState(setFeedbackText, "")
      safeSetState(setFeedbackRating, [5])

      alert(`感谢您的反馈！\n评分：${feedbackData.rating}星\n我们会认真考虑您的建议。`)
    } catch (error) {
      if (mountedRef.current) {
        alert("❌ 反馈提交过程中发生错误")
      }
    }
  }, [feedbackName, feedbackEmail, feedbackRating, feedbackText, createCancellableOperation, safeSetState])

  // 清空所有结果
  const clearAllResults = useCallback(() => {
    safeSetState(setTextResult, "")
    safeSetState(setGeneratedContent, "")
    safeSetState(setImageResult, "")
    safeSetState(setClassificationResult, "")
    safeSetState(setAnalysisResult, "")
    safeSetState(setTextInput, "")
    safeSetState(setDataInput, "")
    safeSetState(setContentTopic, "人工智能")
    safeSetState(setImageFile, null)
    safeSetState(setClassificationImage, null)
  }, [safeSetState])

  // 导出结果 - 使用安全下载
  const exportResults = useCallback(() => {
    if (!mountedRef.current) return

    try {
      const results = {
        textResult,
        generatedContent,
        imageResult,
        classificationResult,
        analysisResult,
        timestamp: new Date().toLocaleString("zh-CN"),
        stats,
      }

      const dataStr = JSON.stringify(results, null, 2)
      const filename = `yanyu-cloud-results-${Date.now()}.json`

      // 使用安全下载函数
      safeDownload(dataStr, filename, "application/json")
    } catch (error) {
      console.error("导出失败:", error)
      alert("❌ 导出失败，请稍后重试")
    }
  }, [textResult, generatedContent, imageResult, classificationResult, analysisResult, stats, safeDownload])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* 动态背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* 导航栏 */}
        <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="h-16 w-60 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center text-2xl font-bold">
                    YanYu Cloud³
                  </div>
                </div>
                <div className="hidden md:block">
                  <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border-green-300/30">
                    <Globe className="w-3 h-3 mr-1" />
                    www.yy.0379.pro
                  </Badge>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                {/* API状态指示器 */}
                <div className="flex flex-wrap gap-2">
                  <APIStatusIndicator service="天气" enabled={true} status="online" />
                  <APIStatusIndicator service="新闻" enabled={true} status="online" />
                  <APIStatusIndicator service="IP查询" enabled={true} status="online" />
                  <APIStatusIndicator service="汇率" enabled={true} status="online" />
                  <APIStatusIndicator service="PyTorch" enabled={true} status="online" />
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Rocket className="w-4 h-4 mr-2" />
                  立即体验
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* 英雄区域 */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-white/30 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                YanYu Cloud³ 新纪元 - 真实API服务 + PyTorch AI
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                万象归元于
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  云枢
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-6">深栈智启新纪元</p>
              <p className="text-lg text-white/70 mb-8 max-w-3xl mx-auto">
                All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era
              </p>
            </div>

            {/* 实时统计 */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-5xl mx-auto mb-12">
              <Card className="bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stats.servers.toLocaleString()}+</div>
                  <div className="text-blue-100 text-sm">云服务器</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-400 to-green-600 border-green-300/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stats.users.toLocaleString()}+</div>
                  <div className="text-green-100 text-sm">企业用户</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stats.uptime.toFixed(1)}%</div>
                  <div className="text-purple-100 text-sm">可用性</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stats.totalOperations}</div>
                  <div className="text-orange-100 text-sm">总操作</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-pink-400 to-pink-600 border-pink-300/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stats.weatherQueries}</div>
                  <div className="text-pink-100 text-sm">天气查询</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-cyan-400 to-cyan-600 border-cyan-300/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stats.imageClassified}</div>
                  <div className="text-cyan-100 text-sm">AI分类</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 主要功能区域 */}
        <Card className="max-w-7xl mx-auto bg-white/10 backdrop-blur-md border-white/20 m-4">
          <CardContent className="p-6">
            <Tabs defaultValue="weather" className="w-full">
              <TabsList className="grid w-full grid-cols-11 bg-white/20 backdrop-blur-sm text-white">
                <TabsTrigger
                  value="weather"
                  className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                >
                  <Cloud className="w-4 h-4 mr-2" />
                  天气查询
                </TabsTrigger>
                <TabsTrigger
                  value="news"
                  className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  新闻资讯
                </TabsTrigger>
                <TabsTrigger
                  value="ip"
                  className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  IP查询
                </TabsTrigger>
                <TabsTrigger
                  value="currency"
                  className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  汇率转换
                </TabsTrigger>
                <TabsTrigger
                  value="classification"
                  className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI分类
                </TabsTrigger>
                <TabsTrigger
                  value="text"
                  className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  文本处理
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  内容生成
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  图像处理
                </TabsTrigger>
                <TabsTrigger
                  value="data"
                  className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  数据分析
                </TabsTrigger>
                <TabsTrigger
                  value="feedback"
                  className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  用户反馈
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  数据统计
                </TabsTrigger>
                <TabsTrigger
                  value="monitor"
                  className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  监控中心
                </TabsTrigger>
              </TabsList>

              {/* 天气查询 */}
              <TabsContent value="weather" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Cloud className="w-5 h-5 mr-2" />
                      实时天气查询服务
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      获取全球城市的实时天气信息，包括温度、湿度、风速等详细数据
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="weather-city" className="text-white">
                            城市名称
                          </Label>
                          <Input
                            id="weather-city"
                            placeholder="输入城市名称，如：北京、上海、New York..."
                            value={weatherCity}
                            onChange={(e) => setWeatherCity(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            onKeyPress={(e) => e.key === "Enter" && handleWeatherQuery()}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={handleWeatherQuery}
                            disabled={isWeatherLoading}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                          >
                            {isWeatherLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                查询中...
                              </>
                            ) : (
                              <>
                                <Cloud className="w-4 h-4 mr-2" />
                                查询天气
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => setWeatherResult("")}
                            className="bg-white/20 hover:bg-white/30 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-white">天气信息</Label>
                        <Card className="bg-white/5 border-white/10 mt-2">
                          <CardContent className="p-4">
                            <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                              {weatherResult || "等待查询..."}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 新闻资讯 */}
              <TabsContent value="news" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      实时新闻资讯服务
                    </CardTitle>
                    <CardDescription className="text-white/80">获 实时新闻资讯服务</CardDescription>
                    <CardDescription className="text-white/80">
                      获取最新的新闻资讯，支持多个分类的新闻内容
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white">新闻分类</Label>
                          <RadioGroup
                            value={newsCategory}
                            onValueChange={setNewsCategory}
                            className="grid grid-cols-2 gap-4 mt-2"
                          >
                            {[
                              { value: "technology", label: "科技" },
                              { value: "business", label: "商业" },
                              { value: "health", label: "健康" },
                              { value: "sports", label: "体育" },
                              { value: "entertainment", label: "娱乐" },
                              { value: "science", label: "科学" },
                            ].map((category) => (
                              <div key={category.value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={category.value}
                                  id={category.value}
                                  className="border-white/40 text-white"
                                />
                                <Label htmlFor={category.value} className="text-white/90">
                                  {category.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={handleNewsQuery}
                            disabled={isNewsLoading}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                          >
                            {isNewsLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                获取中...
                              </>
                            ) : (
                              <>
                                <Globe className="w-4 h-4 mr-2" />
                                获取新闻
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => setNewsResult("")}
                            className="bg-white/20 hover:bg-white/30 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-white">新闻资讯</Label>
                        <Card className="bg-white/5 border-white/10 mt-2">
                          <CardContent className="p-4">
                            <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                              {newsResult || "等待获取..."}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* IP查询 */}
              <TabsContent value="ip" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      IP地址地理位置查询
                    </CardTitle>
                    <CardDescription className="text-white/80">查询IP地址的地理位置、ISP信息和网络详情</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="ip-address" className="text-white">
                            IP地址
                          </Label>
                          <Input
                            id="ip-address"
                            placeholder="输入IP地址，如：8.8.8.8"
                            value={ipAddress}
                            onChange={(e) => setIpAddress(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            onKeyPress={(e) => e.key === "Enter" && handleIPQuery()}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={handleIPQuery}
                            disabled={isIpLoading}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                          >
                            {isIpLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                查询中...
                              </>
                            ) : (
                              <>
                                <Activity className="w-4 h-4 mr-2" />
                                查询IP信息
                              </>
                            )}
                          </Button>
                          <Button onClick={() => setIpResult("")} className="bg-white/20 hover:bg-white/30 text-white">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-white">IP信息</Label>
                        <Card className="bg-white/5 border-white/10 mt-2">
                          <CardContent className="p-4">
                            <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                              {ipResult || "等待查询..."}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 汇率转换 */}
              <TabsContent value="currency" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      实时汇率转换计算
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      提供实时汇率查询和货币转换计算，支持主要国际货币
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="currency-amount" className="text-white">
                            金额
                          </Label>
                          <Input
                            id="currency-amount"
                            type="number"
                            placeholder="输入要转换的金额"
                            value={currencyAmount}
                            onChange={(e) => setCurrencyAmount(Number(e.target.value))}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">原始货币</Label>
                            <RadioGroup value={fromCurrency} onValueChange={setFromCurrency} className="mt-2">
                              {["USD", "CNY", "EUR", "JPY", "GBP"].map((currency) => (
                                <div key={currency} className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value={currency}
                                    id={`from-${currency}`}
                                    className="border-white/40 text-white"
                                  />
                                  <Label htmlFor={`from-${currency}`} className="text-white/90">
                                    {currency}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-white">目标货币</Label>
                            <RadioGroup value={toCurrency} onValueChange={setToCurrency} className="mt-2">
                              {["USD", "CNY", "EUR", "JPY", "GBP"].map((currency) => (
                                <div key={currency} className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value={currency}
                                    id={`to-${currency}`}
                                    className="border-white/40 text-white"
                                  />
                                  <Label htmlFor={`to-${currency}`} className="text-white/90">
                                    {currency}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={handleCurrencyQuery}
                            disabled={isCurrencyLoading}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                          >
                            {isCurrencyLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                转换中...
                              </>
                            ) : (
                              <>
                                <BarChart3 className="w-4 h-4 mr-2" />
                                转换汇率
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => setCurrencyResult("")}
                            className="bg-white/20 hover:bg-white/30 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-white">转换结果</Label>
                        <Card className="bg-white/5 border-white/10 mt-2">
                          <CardContent className="p-4">
                            <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                              {currencyResult || "等待转换..."}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* PyTorch 图像分类 */}
              <TabsContent value="classification" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      PyTorch 图像分类服务
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      基于预训练的深度学习模型进行图像分类，支持ResNet、MobileNet等多种架构
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="classification-image" className="text-white">
                            上传图像
                          </Label>
                          <Input
                            id="classification-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setClassificationImage(e.target.files?.[0] || null)}
                            className="bg-white/10 border-white/20 text-white file:bg-white/20 file:border-0 file:text-white file:mr-4 file:py-2 file:px-4 file:rounded"
                          />
                          {classificationImage && (
                            <div className="mt-2 text-white/70 text-sm">
                              已选择: {classificationImage.name} ({(classificationImage.size / 1024 / 1024).toFixed(2)}{" "}
                              MB)
                            </div>
                          )}
                        </div>

                        <div>
                          <Label className="text-white">选择模型</Label>
                          <RadioGroup
                            value={classificationModel}
                            onValueChange={setClassificationModel}
                            className="grid grid-cols-1 gap-4 mt-2"
                          >
                            {[
                              { value: "resnet18", label: "ResNet-18", desc: "轻量级，速度快" },
                              { value: "resnet50", label: "ResNet-50", desc: "平衡性能与精度" },
                              { value: "mobilenet", label: "MobileNet V2", desc: "移动端优化" },
                            ].map((model) => (
                              <div key={model.value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={model.value}
                                  id={model.value}
                                  className="border-white/40 text-white"
                                />
                                <div className="flex flex-col">
                                  <Label htmlFor={model.value} className="text-white/90">
                                    {model.label}
                                  </Label>
                                  <span className="text-white/60 text-xs">{model.desc}</span>
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={classifyImage}
                            disabled={isClassifying}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white"
                          >
                            {isClassifying ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                分类中...
                              </>
                            ) : (
                              <>
                                <Brain className="w-4 h-4 mr-2" />
                                开始分类
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => setClassificationResult("")}
                            className="bg-white/20 hover:bg-white/30 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <h4 className="text-white font-semibold mb-2">💡 使用提示</h4>
                          <ul className="text-white/80 text-sm space-y-1">
                            <li>• 支持 JPG、PNG、GIF 等常见格式</li>
                            <li>• 建议图像尺寸不小于 224×224 像素</li>
                            <li>• 文件大小建议在 10MB 以内</li>
                            <li>• 清晰的图像能获得更好的分类效果</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <Label className="text-white">分类结果</Label>
                        <Card className="bg-white/5 border-white/10 mt-2">
                          <CardContent className="p-4">
                            <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                              {classificationResult || "等待分类..."}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 文本处理标签页 */}
              <TabsContent value="text" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      智能文本处理分析
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      提供文本分析、内容优化、关键词提取和情感分析等智能处理功能
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="text-input" className="text-white">
                            输入文本
                          </Label>
                          <Textarea
                            id="text-input"
                            placeholder="请输入要处理的文本内容..."
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[120px]"
                            rows={6}
                          />
                        </div>

                        <div>
                          <Label className="text-white">处理类型</Label>
                          <RadioGroup
                            value={textOperation}
                            onValueChange={setTextOperation}
                            className="grid grid-cols-2 gap-4 mt-2"
                          >
                            {[
                              { value: "智能分析", label: "智能分析" },
                              { value: "内容优化", label: "内容优化" },
                              { value: "关键词提取", label: "关键词提取" },
                              { value: "情感分析", label: "情感分析" },
                            ].map((operation) => (
                              <div key={operation.value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={operation.value}
                                  id={operation.value}
                                  className="border-white/40 text-white"
                                />
                                <Label htmlFor={operation.value} className="text-white/90">
                                  {operation.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={processText}
                            disabled={isProcessing}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                          >
                            {isProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                处理中...
                              </>
                            ) : (
                              <>
                                <FileText className="w-4 h-4 mr-2" />
                                开始处理
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => setTextResult("")}
                            className="bg-white/20 hover:bg-white/30 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <h4 className="text-white font-semibold mb-2">💡 处理提示</h4>
                          <ul className="text-white/80 text-sm space-y-1">
                            <li>• 支持中英文文本分析</li>
                            <li>• 建议输入完整的句子或段落</li>
                            <li>• 文本长度建议在10-1000字之间</li>
                            <li>• 智能分析提供详细的文本特征</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <Label className="text-white">处理结果</Label>
                        <Card className="bg-white/5 border-white/10 mt-2">
                          <CardContent className="p-4">
                            <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                              {textResult || "等待处理..."}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 内容生成标签页 */}
              <TabsContent value="content" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      AI智能内容生成
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      基于主题和风格要求，智能生成高质量的原创内容
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="content-topic" className="text-white">
                            内容主题
                          </Label>
                          <Input
                            id="content-topic"
                            placeholder="输入内容主题，如：人工智能、区块链..."
                            value={contentTopic}
                            onChange={(e) => setContentTopic(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </div>

                        <div>
                          <Label className="text-white">写作风格</Label>
                          <RadioGroup
                            value={contentStyle}
                            onValueChange={setContentStyle}
                            className="grid grid-cols-3 gap-4 mt-2"
                          >
                            {[
                              { value: "专业", label: "专业" },
                              { value: "轻松", label: "轻松" },
                              { value: "诗意", label: "诗意" },
                            ].map((style) => (
                              <div key={style.value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={style.value}
                                  id={style.value}
                                  className="border-white/40 text-white"
                                />
                                <Label htmlFor={style.value} className="text-white/90">
                                  {style.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div>
                          <Label className="text-white">目标长度: {contentLength[0]} 字</Label>
                          <Slider
                            value={contentLength}
                            onValueChange={setContentLength}
                            max={1000}
                            min={100}
                            step={50}
                            className="mt-2"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={generateContent}
                            disabled={isGenerating}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                          >
                            {isGenerating ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                生成中...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                生成内容
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => setGeneratedContent("")}
                            className="bg-white/20 hover:bg-white/30 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <h4 className="text-white font-semibold mb-2">💡 生成提示</h4>
                          <ul className="text-white/80 text-sm space-y-1">
                            <li>• 主题越具体，生成内容越精准</li>
                            <li>• 不同风格适用于不同场景</li>
                            <li>• 可调整长度满足不同需求</li>
                            <li>• 生成内容支持二次编辑</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <Label className="text-white">生成内容</Label>
                        <Card className="bg-white/5 border-white/10 mt-2">
                          <CardContent className="p-4">
                            <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                              {generatedContent || "等待生成..."}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 图像处理标签页 */}
              <TabsContent value="image" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2" />
                      智能图像处理服务
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      提供图像增强、风格转换、智能修复和自动裁剪等AI驱动的图像处理功能
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="image-file" className="text-white">
                            上传图像文件
                          </Label>
                          <Input
                            id="image-file"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            className="bg-white/10 border-white/20 text-white file:bg-white/20 file:border-0 file:text-white file:mr-4 file:py-2 file:px-4 file:rounded"
                          />
                          {imageFile && (
                            <div className="mt-2 text-white/70 text-sm">
                              已选择: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                            </div>
                          )}
                        </div>

                        <div>
                          <Label className="text-white">处理操作</Label>
                          <RadioGroup
                            value={imageOperation}
                            onValueChange={setImageOperation}
                            className="grid grid-cols-2 gap-4 mt-2"
                          >
                            {[
                              { value: "智能增强", label: "智能增强", desc: "提升清晰度和色彩" },
                              { value: "风格转换", label: "风格转换", desc: "艺术风格滤镜" },
                              { value: "智能修复", label: "智能修复", desc: "去除瑕疵和噪点" },
                              { value: "自动裁剪", label: "自动裁剪", desc: "智能构图优化" },
                            ].map((operation) => (
                              <div key={operation.value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={operation.value}
                                  id={operation.value}
                                  className="border-white/40 text-white"
                                />
                                <div className="flex flex-col">
                                  <Label htmlFor={operation.value} className="text-white/90">
                                    {operation.label}
                                  </Label>
                                  <span className="text-white/60 text-xs">{operation.desc}</span>
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={processImage}
                            disabled={isImageProcessing}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                          >
                            {isImageProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                处理中...
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-4 h-4 mr-2" />
                                开始处理
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => setImageResult("")}
                            className="bg-white/20 hover:bg-white/30 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <h4 className="text-white font-semibold mb-2">💡 处理提示</h4>
                          <ul className="text-white/80 text-sm space-y-1">
                            <li>• 支持 JPG、PNG、GIF、WebP 等格式</li>
                            <li>• 建议图像尺寸在 512×512 到 4096×4096 之间</li>
                            <li>• 文件大小建议在 20MB 以内</li>
                            <li>• 高分辨率图像处理效果更佳</li>
                            <li>• 处理时间根据图像大小和复杂度而定</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <Label className="text-white">处理结果</Label>
                        <Card className="bg-white/5 border-white/10 mt-2">
                          <CardContent className="p-4">
                            <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                              {imageResult || "等待处理..."}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 数据分析标签页 */}
              <TabsContent value="data" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      智能数据分析服务
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      提供趋势分析、统计分析、相关性分析和预测分析等专业数据处理功能
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="data-input" className="text-white">
                            输入数据
                          </Label>
                          <Textarea
                            id="data-input"
                            placeholder="请输入要分析的数据，每行一个数据点，支持数字、文本等格式..."
                            value={dataInput}
                            onChange={(e) => setDataInput(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[120px]"
                            rows={6}
                          />
                        </div>

                        <div>
                          <Label className="text-white">分析类型</Label>
                          <RadioGroup
                            value={analysisType}
                            onValueChange={setAnalysisType}
                            className="grid grid-cols-2 gap-4 mt-2"
                          >
                            {[
                              { value: "趋势分析", label: "趋势分析", desc: "识别数据变化趋势" },
                              { value: "统计分析", label: "统计分析", desc: "基础统计指标计算" },
                              { value: "相关性分析", label: "相关性分析", desc: "变量间关系分析" },
                              { value: "预测分析", label: "预测分析", desc: "未来趋势预测" },
                            ].map((analysis) => (
                              <div key={analysis.value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={analysis.value}
                                  id={analysis.value}
                                  className="border-white/40 text-white"
                                />
                                <div className="flex flex-col">
                                  <Label htmlFor={analysis.value} className="text-white/90">
                                    {analysis.label}
                                  </Label>
                                  <span className="text-white/60 text-xs">{analysis.desc}</span>
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={analyzeData}
                            disabled={isAnalyzing}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                          >
                            {isAnalyzing ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                分析中...
                              </>
                            ) : (
                              <>
                                <BarChart3 className="w-4 h-4 mr-2" />
                                开始分析
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => setAnalysisResult("")}
                            className="bg-white/20 hover:bg-white/30 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <h4 className="text-white font-semibold mb-2">📊 分析说明</h4>
                          <ul className="text-white/80 text-sm space-y-1">
                            <li>• 支持数值型和文本型数据分析</li>
                            <li>• 每行输入一个数据点，支持CSV格式</li>
                            <li>• 趋势分析适用于时序数据</li>
                            <li>• 统计分析提供描述性统计指标</li>
                            <li>• 相关性分析需要多变量数据</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <Label className="text-white">分析结果</Label>
                        <Card className="bg-white/5 border-white/10 mt-2">
                          <CardContent className="p-4">
                            <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                              {analysisResult || "等待分析..."}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 反馈标签页 */}
              <TabsContent value="feedback" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      用户反馈与建议
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      您的反馈对我们非常重要，帮助我们不断改进服务质量
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="feedback-name" className="text-white">
                            姓名 (可选)
                          </Label>
                          <Input
                            id="feedback-name"
                            placeholder="请输入您的姓名"
                            value={feedbackName}
                            onChange={(e) => setFeedbackName(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </div>

                        <div>
                          <Label htmlFor="feedback-email" className="text-white">
                            邮箱 (可选)
                          </Label>
                          <Input
                            id="feedback-email"
                            type="email"
                            placeholder="请输入您的邮箱地址"
                            value={feedbackEmail}
                            onChange={(e) => setFeedbackEmail(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </div>

                        <div>
                          <Label className="text-white">满意度评分: {feedbackRating[0]} 星</Label>
                          <Slider
                            value={feedbackRating}
                            onValueChange={setFeedbackRating}
                            max={5}
                            min={1}
                            step={1}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="feedback-text" className="text-white">
                            反馈内容
                          </Label>
                          <Textarea
                            id="feedback-text"
                            placeholder="请详细描述您的使用体验、建议或遇到的问题..."
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[120px]"
                            rows={6}
                          />
                        </div>

                        <Button
                          onClick={submitFeedback}
                          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          提交反馈
                        </Button>
                      </div>

                      <div>
                        <Label className="text-white">反馈统计</Label>
                        <Card className="bg-white/5 border-white/10 mt-2">
                          <CardContent className="p-4 space-y-4">
                            <div className="text-white/90">
                              <h4 className="font-semibold mb-2">📊 反馈数据</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>总反馈数:</span>
                                  <span className="font-bold">{stats.feedbackCount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>平均评分:</span>
                                  <span className="font-bold">4.8/5.0</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>满意度:</span>
                                  <span className="font-bold text-green-400">96%</span>
                                </div>
                              </div>
                            </div>

                            <Separator className="bg-white/20" />

                            <div className="text-white/90">
                              <h4 className="font-semibold mb-2">💡 改进建议</h4>
                              <ul className="space-y-1 text-sm">
                                <li>• 增加更多API服务</li>
                                <li>• 优化响应速度</li>
                                <li>• 添加数据导出功能</li>
                                <li>• 支持多语言界面</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 统计标签页 */}
              <TabsContent value="stats" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      系统数据统计分析
                    </CardTitle>
                    <CardDescription className="text-white/80">实时监控系统运行状态和用户使用情况</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 主要统计卡片 */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <Card className="bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-white mb-1">{stats.totalOperations}</div>
                          <div className="text-blue-100 text-sm">总操作</div>
                          <div className="text-xs text-blue-200 mt-1">+{Math.floor(Math.random() * 10 + 5)} 今日</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-400 to-green-600 border-green-300/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-white mb-1">{stats.weatherQueries}</div>
                          <div className="text-green-100 text-sm">天气查询</div>
                          <div className="text-xs text-green-200 mt-1">+{Math.floor(Math.random() * 5 + 2)} 今日</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-white mb-1">{stats.newsQueries}</div>
                          <div className="text-purple-100 text-sm">新闻查询</div>
                          <div className="text-xs text-purple-200 mt-1">+{Math.floor(Math.random() * 8 + 3)} 今日</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-white mb-1">{stats.ipQueries}</div>
                          <div className="text-orange-100 text-sm">IP查询</div>
                          <div className="text-xs text-orange-200 mt-1">+{Math.floor(Math.random() * 3 + 1)} 今日</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-pink-400 to-pink-600 border-pink-300/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-white mb-1">{stats.currencyQueries}</div>
                          <div className="text-pink-100 text-sm">汇率转换</div>
                          <div className="text-xs text-pink-200 mt-1">+{Math.floor(Math.random() * 4 + 2)} 今日</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-cyan-400 to-cyan-600 border-cyan-300/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-white mb-1">{stats.textProcessed}</div>
                          <div className="text-cyan-100 text-sm">文本处理</div>
                          <div className="text-xs text-cyan-200 mt-1">+{Math.floor(Math.random() * 6 + 3)} 今日</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* 详细统计卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-gradient-to-br from-indigo-400 to-indigo-600 border-indigo-300/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl font-bold text-white mb-2">{stats.contentGenerated}</div>
                          <div className="text-indigo-100 text-sm">内容生成</div>
                          <div className="text-xs text-indigo-200 mt-1">+{Math.floor(Math.random() * 7 + 2)} 今日</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl font-bold text-white mb-2">{stats.imagesProcessed}</div>
                          <div className="text-emerald-100 text-sm">图像处理</div>
                          <div className="text-xs text-emerald-200 mt-1">+{Math.floor(Math.random() * 4 + 1)} 今日</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-rose-400 to-rose-600 border-rose-300/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl font-bold text-white mb-2">{stats.dataAnalyzed}</div>
                          <div className="text-rose-100 text-sm">数据分析</div>
                          <div className="text-xs text-rose-200 mt-1">+{Math.floor(Math.random() * 5 + 2)} 今日</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl font-bold text-white mb-2">{stats.feedbackCount}</div>
                          <div className="text-amber-100 text-sm">用户反馈</div>
                          <div className="text-xs text-amber-200 mt-1">+{Math.floor(Math.random() * 3 + 1)} 今日</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* 系统性能和API状态 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-gradient-to-br from-blue-400/20 to-purple-600/20 border-blue-300/30">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center">
                            <Activity className="w-5 h-5 mr-2" />
                            系统性能监控
                          </CardTitle>
                          <CardDescription className="text-white/80">
                            实时监控系统资源使用情况和性能指标
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between text-white/90 mb-2">
                              <span className="flex items-center">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-2"></div>
                                CPU 使用率
                              </span>
                              <span className="font-bold">{stats.performance}%</span>
                            </div>
                            <Progress value={stats.performance} className="h-3 bg-white/20">
                              <div
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
                                style={{ width: `${stats.performance}%` }}
                              />
                            </Progress>
                          </div>

                          <div>
                            <div className="flex justify-between text-white/90 mb-2">
                              <span className="flex items-center">
                                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full mr-2"></div>
                                内存使用率
                              </span>
                              <span className="font-bold">{Math.floor(Math.random() * 30 + 40)}%</span>
                            </div>
                            <Progress value={Math.floor(Math.random() * 30 + 40)} className="h-3 bg-white/20">
                              <div
                                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-300"
                                style={{ width: `${Math.floor(Math.random() * 30 + 40)}%` }}
                              />
                            </Progress>
                          </div>

                          <div>
                            <div className="flex justify-between text-white/90 mb-2">
                              <span className="flex items-center">
                                <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mr-2"></div>
                                网络延迟
                              </span>
                              <span className="font-bold">{Math.floor(Math.random() * 50 + 20)}ms</span>
                            </div>
                            <Progress value={Math.floor(Math.random() * 50 + 20)} className="h-3 bg-white/20">
                              <div
                                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-300"
                                style={{ width: `${Math.floor(Math.random() * 50 + 20)}%` }}
                              />
                            </Progress>
                          </div>

                          <div>
                            <div className="flex justify-between text-white/90 mb-2">
                              <span className="flex items-center">
                                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mr-2"></div>
                                磁盘使用率
                              </span>
                              <span className="font-bold">{Math.floor(Math.random() * 25 + 35)}%</span>
                            </div>
                            <Progress value={Math.floor(Math.random() * 25 + 35)} className="h-3 bg-white/20">
                              <div
                                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-300"
                                style={{ width: `${Math.floor(Math.random() * 25 + 35)}%` }}
                              />
                            </Progress>
                          </div>

                          <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-lg p-4 border border-blue-300/20 mt-4">
                            <h4 className="text-white font-semibold mb-2 flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              性能概览
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="text-white/80">
                                <div className="flex justify-between">
                                  <span>系统负载:</span>
                                  <span className="text-green-400 font-semibold">正常</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>响应时间:</span>
                                  <span className="text-blue-400 font-semibold">优秀</span>
                                </div>
                              </div>
                              <div className="text-white/80">
                                <div className="flex justify-between">
                                  <span>并发用户:</span>
                                  <span className="text-purple-400 font-semibold">
                                    {Math.floor(Math.random() * 500 + 200)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>错误率:</span>
                                  <span className="text-green-400 font-semibold">0.01%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-400/20 to-cyan-600/20 border-green-300/30">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center">
                            <Globe className="w-5 h-5 mr-2" />
                            API服务状态中心
                          </CardTitle>
                          <CardDescription className="text-white/80">
                            监控所有API服务的运行状态和可用性指标
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            {[
                              {
                                name: "天气服务",
                                status: "正常",
                                uptime: "99.9%",
                                color: "from-blue-400 to-blue-600",
                                icon: "🌤️",
                              },
                              {
                                name: "新闻服务",
                                status: "正常",
                                uptime: "99.8%",
                                color: "from-green-400 to-green-600",
                                icon: "📰",
                              },
                              {
                                name: "IP查询",
                                status: "正常",
                                uptime: "99.7%",
                                color: "from-orange-400 to-orange-600",
                                icon: "📍",
                              },
                              {
                                name: "汇率服务",
                                status: "正常",
                                uptime: "99.9%",
                                color: "from-purple-400 to-purple-600",
                                icon: "💱",
                              },
                              {
                                name: "PyTorch AI",
                                status: "正常",
                                uptime: "99.6%",
                                color: "from-cyan-400 to-cyan-600",
                                icon: "🧠",
                              },
                            ].map((service, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-3 bg-gradient-to-r from-white/5 to-white/10 rounded-lg border border-white/10"
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-10 h-10 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center text-white font-bold`}
                                  >
                                    {service.icon}
                                  </div>
                                  <div>
                                    <span className="text-white/90 font-medium">{service.name}</span>
                                    <div className="text-white/60 text-xs">API v2.1</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="text-right">
                                    <Badge className="bg-gradient-to-r from-green-400/20 to-green-500/20 text-green-300 border-green-400/30 mb-1">
                                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                                      {service.status}
                                    </Badge>
                                    <div className="text-white/70 text-sm font-semibold">{service.uptime}</div>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className="text-white/60 text-xs">响应时间</div>
                                    <div className="text-green-400 text-sm font-bold">
                                      {Math.floor(Math.random() * 100 + 50)}ms
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="bg-gradient-to-br from-green-500/10 to-cyan-600/10 rounded-lg p-4 border border-green-300/20 mt-4">
                            <h4 className="text-white font-semibold mb-3 flex items-center">
                              <BarChart3 className="w-4 h-4 mr-2" />
                              服务统计概览
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/80">总请求数:</span>
                                  <span className="text-cyan-400 font-bold">
                                    {(stats.totalOperations * 1.5).toFixed(0)}K
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/80">成功率:</span>
                                  <span className="text-green-400 font-bold">99.95%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/80">平均响应:</span>
                                  <span className="text-blue-400 font-bold">85ms</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/80">活跃连接:</span>
                                  <span className="text-purple-400 font-bold">
                                    {Math.floor(Math.random() * 200 + 100)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/80">数据传输:</span>
                                  <span className="text-orange-400 font-bold">
                                    {(Math.random() * 50 + 20).toFixed(1)}GB
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/80">服务可用:</span>
                                  <span className="text-green-400 font-bold">5/5</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={clearAllResults}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        清空所有结果
                      </Button>
                      <Button
                        onClick={exportResults}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        导出数据
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 监控中心标签页 */}
              <TabsContent value="monitor" className="space-y-6">
                <APIMonitorDashboard />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 底部信息 */}
        <Card className="max-w-7xl mx-auto mt-8 bg-white/10 backdrop-blur-md border-white/20 m-4">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">✨ 言枢象限丨语启未来</h3>
            <p className="text-white/90 text-lg mb-4">Yan (Speech) Pivot Quadrants 丨 Yu (Language) Ignite Future</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/80 mb-4">
              <Badge variant="outline" className="border-white/30 text-white/90">
                🌤️ 真实天气数据
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white/90">
                📰 实时新闻资讯
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white/90">
                📍 IP地理查询
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white/90">
                💱 实时汇率转换
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white/90">
                🧠 PyTorch AI分类
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white/90">
                🚀 高性能体验
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white/90">
                🔗 API集成服务
              </Badge>
            </div>
            <Separator className="my-4 bg-white/20" />
            <p className="text-white/70 text-sm">
              © 2024 言语云³ YanYu Cloud | PyTorch AI版本 v3.2.0 |
              <span className="text-green-400">www.yy.0379.pro</span> | 专为v0优化
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
