"""
天空蓝炫酷 Gradio 综合应用
集成多种功能的现代化Web应用
"""
import gradio as gr
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from PIL import Image, ImageFilter, ImageEnhance
import random
import datetime
import json
import io
import base64

# 全局数据存储
app_data = {
    "user_feedback": [],
    "generated_content": [],
    "processing_history": [],
    "user_stats": {
        "total_operations": 0,
        "text_processed": 0,
        "images_processed": 0,
        "content_generated": 0
    }
}

# 自定义CSS样式
custom_css = """
/* 全局样式重置和天空蓝主题 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 主体背景 - 天蓝流光效果 */
body, .gradio-container {
    background: linear-gradient(135deg, 
        #87CEEB 0%, 
        #4169E1 25%, 
        #1E90FF 50%, 
        #00BFFF 75%, 
        #87CEFA 100%) !important;
    background-size: 400% 400% !important;
    animation: skyGradient 8s ease infinite !important;
    color: white !important;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
}

/* 流光动画 */
@keyframes skyGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* 容器样式 */
.gradio-container {
    max-width: 1400px !important;
    margin: 0 auto !important;
    padding: 20px !important;
}

/* 标题样式 */
h1, h2, h3, h4, h5, h6 {
    color: white !important;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3) !important;
    font-weight: bold !important;
}

/* 主标题特效 */
.main-title {
    background: linear-gradient(45deg, #FFD700, #FFF, #87CEEB, #FFF) !important;
    background-size: 400% 400% !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    animation: titleShine 3s ease-in-out infinite !important;
    font-size: 2.5em !important;
    text-align: center !important;
    margin: 20px 0 !important;
}

@keyframes titleShine {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

/* 卡片容器 */
.block-container, .form, .panel {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 15px !important;
    padding: 20px !important;
    margin: 10px 0 !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

/* 按钮立体效果 */
.btn, button, .gr-button {
    background: linear-gradient(145deg, #4169E1, #1E90FF) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 12px 24px !important;
    color: white !important;
    font-weight: bold !important;
    font-size: 14px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    box-shadow: 
        0 6px 12px rgba(65, 105, 225, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
    position: relative !important;
    overflow: hidden !important;
}

.btn:hover, button:hover, .gr-button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 
        0 8px 16px rgba(65, 105, 225, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
    background: linear-gradient(145deg, #5179F1, #2EA0FF) !important;
}

.btn:active, button:active, .gr-button:active {
    transform: translateY(0px) !important;
    box-shadow: 
        0 4px 8px rgba(65, 105, 225, 0.4),
        inset 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

/* 按钮光效 */
.btn::before, button::before, .gr-button::before {
    content: '' !important;
    position: absolute !important;
    top: 0 !important;
    left: -100% !important;
    width: 100% !important;
    height: 100% !important;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent) !important;
    transition: left 0.5s !important;
}

.btn:hover::before, button:hover::before, .gr-button:hover::before {
    left: 100% !important;
}

/* 主要按钮样式 */
.btn-primary, .primary {
    background: linear-gradient(145deg, #FF6B6B, #FF8E8E) !important;
    box-shadow: 
        0 6px 12px rgba(255, 107, 107, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}

.btn-primary:hover, .primary:hover {
    background: linear-gradient(145deg, #FF7B7B, #FF9E9E) !important;
    box-shadow: 
        0 8px 16px rgba(255, 107, 107, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
}

/* 输入框样式 */
input, textarea, select {
    background: rgba(255, 255, 255, 0.15) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    border-radius: 8px !important;
    padding: 10px !important;
    color: white !important;
    font-size: 14px !important;
    backdrop-filter: blur(5px) !important;
}

input::placeholder, textarea::placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
}

input:focus, textarea:focus, select:focus {
    outline: none !important;
    border-color: #87CEEB !important;
    box-shadow: 0 0 10px rgba(135, 206, 235, 0.5) !important;
}

/* 标签页样式 */
.tab-nav {
    background: rgba(255, 255, 255, 0.1) !important;
    border-radius: 10px !important;
    padding: 5px !important;
}

.tab-nav button {
    background: transparent !important;
    border: none !important;
    color: rgba(255, 255, 255, 0.8) !important;
    padding: 10px 20px !important;
    border-radius: 8px !important;
    transition: all 0.3s ease !important;
}

.tab-nav button.selected {
    background: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

/* 输出区域样式 */
.output {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 10px !important;
    padding: 15px !important;
    color: white !important;
    backdrop-filter: blur(5px) !important;
}

/* 滑块样式 */
.gr-slider input[type="range"] {
    background: rgba(255, 255, 255, 0.2) !important;
    border-radius: 10px !important;
}

.gr-slider input[type="range"]::-webkit-slider-thumb {
    background: linear-gradient(145deg, #4169E1, #1E90FF) !important;
    border: 2px solid white !important;
    border-radius: 50% !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) !important;
}

/* 复选框和单选框样式 */
.gr-checkbox input, .gr-radio input {
    accent-color: #4169E1 !important;
}

/* 进度条样式 */
.progress {
    background: rgba(255, 255, 255, 0.2) !important;
    border-radius: 10px !important;
    overflow: hidden !important;
}

.progress-bar {
    background: linear-gradient(90deg, #4169E1, #1E90FF) !important;
    transition: width 0.3s ease !important;
}

/* 图表容器样式 */
.plot-container {
    background: rgba(255, 255, 255, 0.1) !important;
    border-radius: 10px !important;
    padding: 10px !important;
    backdrop-filter: blur(5px) !important;
}

/* 禁用黑色和深色 */
.dark, .black, [style*="black"], [style*="#000"] {
    color: white !important;
    background: transparent !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .gradio-container {
        padding: 10px !important;
    }
    
    .main-title {
        font-size: 2em !important;
    }
    
    .btn, button, .gr-button {
        padding: 10px 20px !important;
        font-size: 12px !important;
    }
}

/* 加载动画 */
.loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* 成功/错误提示样式 */
.success {
    background: rgba(76, 175, 80, 0.2) !important;
    border-left: 4px solid #4CAF50 !important;
    color: white !important;
}

.error {
    background: rgba(244, 67, 54, 0.2) !important;
    border-left: 4px solid #F44336 !important;
    color: white !important;
}

.warning {
    background: rgba(255, 193, 7, 0.2) !important;
    border-left: 4px solid #FFC107 !important;
    color: white !important;
}

/* 特殊效果 */
.glow {
    box-shadow: 0 0 20px rgba(135, 206, 235, 0.6) !important;
}

.pulse {
    animation: pulse 2s infinite !important;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
"""

def update_stats(operation_type):
    """更新统计数据"""
    app_data["user_stats"]["total_operations"] += 1
    if operation_type in app_data["user_stats"]:
        app_data["user_stats"][operation_type] += 1

def advanced_text_processor(text, operation, case_option, word_limit):
    """高级文本处理器"""
    if not text:
        return "❌ 请输入文本进行处理", ""
    
    update_stats("text_processed")
    
    # 限制字数
    if word_limit > 0:
        words = text.split()[:word_limit]
        text = " ".join(words)
    
    result = text
    stats = ""
    
    try:
        # 执行操作
        if operation == "智能分析":
            word_count = len(text.split())
            char_count = len(text)
            sentence_count = len([s for s in text.split('.') if s.strip()])
            avg_word_length = sum(len(word) for word in text.split()) / word_count if word_count > 0 else 0
            
            result = f"""
📊 智能文本分析报告

📝 基础统计：
• 字符总数：{char_count}
• 单词数量：{word_count}
• 句子数量：{sentence_count}
• 平均词长：{avg_word_length:.2f}

🎯 文本特征：
• 文本密度：{'高' if word_count > 50 else '中' if word_count > 20 else '低'}
• 复杂度：{'复杂' if avg_word_length > 6 else '中等' if avg_word_length > 4 else '简单'}
• 类型判断：{'正式文档' if sentence_count > 3 else '简短消息'}

💡 优化建议：
{random.choice([
    '文本结构清晰，建议保持当前风格',
    '可以适当增加一些连接词提升流畅度',
    '建议检查标点符号的使用',
    '内容丰富，可以考虑分段处理'
])}
"""
            stats = f"✅ 分析完成 | 处理了 {word_count} 个单词"
            
        elif operation == "内容优化":
            # 简单的内容优化逻辑
            optimized = text.replace("  ", " ").strip()
            optimized = ". ".join([s.strip().capitalize() for s in optimized.split(".") if s.strip()])
            result = f"🔧 优化后的文本：\n\n{optimized}"
            stats = "✅ 内容优化完成"
            
        elif operation == "关键词提取":
            words = text.lower().split()
            word_freq = {}
            for word in words:
                if len(word) > 3:  # 只考虑长度大于3的词
                    word_freq[word] = word_freq.get(word, 0) + 1
            
            top_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:10]
            keywords = [word for word, freq in top_words]
            
            result = f"""
🔍 关键词提取结果：

🏷️ 主要关键词：
{chr(10).join([f'• {word} (出现 {freq} 次)' for word, freq in top_words[:5]])}

📋 完整关键词列表：
{', '.join(keywords)}

📊 词频分析：
• 总词汇量：{len(set(words))}
• 重复词汇：{len(words) - len(set(words))}
• 词汇丰富度：{len(set(words))/len(words)*100:.1f}%
"""
            stats = f"✅ 提取了 {len(keywords)} 个关键词"
            
        elif operation == "情感分析":
            # 简单的情感分析
            positive_words = ['好', '棒', '优秀', '喜欢', '爱', '开心', '快乐', '满意', '成功', '完美']
            negative_words = ['坏', '差', '糟糕', '讨厌', '恨', '难过', '失败', '问题', '错误', '困难']
            
            text_lower = text.lower()
            positive_count = sum(1 for word in positive_words if word in text_lower)
            negative_count = sum(1 for word in negative_words if word in text_lower)
            
            if positive_count > negative_count:
                sentiment = "😊 积极"
                confidence = min(90, 60 + positive_count * 10)
            elif negative_count > positive_count:
                sentiment = "😔 消极"
                confidence = min(90, 60 + negative_count * 10)
            else:
                sentiment = "😐 中性"
                confidence = 50
            
            result = f"""
🎭 情感分析结果：

😊 情感倾向：{sentiment}
📊 置信度：{confidence}%

📈 详细分析：
• 积极词汇：{positive_count} 个
• 消极词汇：{negative_count} 个
• 情感强度：{'强烈' if abs(positive_count - negative_count) > 2 else '温和'}

💡 情感建议：
{random.choice([
    '文本情感表达清晰，继续保持',
    '可以适当增加一些情感词汇',
    '建议平衡情感表达的强度',
    '情感色彩丰富，很有感染力'
])}
"""
            stats = f"✅ 情感分析完成 | 置信度 {confidence}%"
        
        # 应用大小写选项
        if case_option == "全部大写":
            if operation != "智能分析":  # 保持分析报告格式
                result = result.upper()
        elif case_option == "全部小写":
            if operation != "智能分析":
                result = result.lower()
        elif case_option == "首字母大写":
            if operation != "智能分析":
                result = result.title()
        
        # 记录处理历史
        app_data["processing_history"].append({
            "type": "text_processing",
            "operation": operation,
            "timestamp": datetime.datetime.now().isoformat(),
            "input_length": len(text),
            "success": True
        })
        
        return result, stats
        
    except Exception as e:
        error_msg = f"❌ 处理错误：{str(e)}"
        return error_msg, "❌ 处理失败"

def smart_image_processor(image, filter_type, intensity, brightness, contrast):
    """智能图像处理器"""
    if image is None:
        return None, "❌ 请先上传图像"
    
    update_stats("images_processed")
    
    try:
        # 确保输入是 PIL Image
        if isinstance(image, np.ndarray):
            image = Image.fromarray(image)
        
        processed_image = image.copy()
        operations = []
        
        # 应用滤镜
        if filter_type == "艺术风格":
            processed_image = processed_image.filter(ImageFilter.EMBOSS)
            operations.append("浮雕艺术效果")
        elif filter_type == "梦幻模糊":
            processed_image = processed_image.filter(ImageFilter.GaussianBlur(radius=intensity))
            operations.append(f"高斯模糊 (半径: {intensity})")
        elif filter_type == "锐化增强":
            for _ in range(int(intensity)):
                processed_image = processed_image.filter(ImageFilter.SHARPEN)
            operations.append(f"锐化增强 (强度: {intensity})")
        elif filter_type == "边缘检测":
            processed_image = processed_image.filter(ImageFilter.FIND_EDGES)
            operations.append("边缘检测")
        elif filter_type == "复古怀旧":
            # 复古效果：降低饱和度，增加暖色调
            processed_image = processed_image.convert('RGB')
            enhancer = ImageEnhance.Color(processed_image)
            processed_image = enhancer.enhance(0.7)  # 降低饱和度
            operations.append("复古怀旧效果")
        elif filter_type == "黑白经典":
            processed_image = processed_image.convert('L').convert('RGB')
            operations.append("黑白转换")
        
        # 调整亮度
        if brightness != 1.0:
            enhancer = ImageEnhance.Brightness(processed_image)
            processed_image = enhancer.enhance(brightness)
            operations.append(f"亮度调整: {brightness:.1f}")
        
        # 调整对比度
        if contrast != 1.0:
            enhancer = ImageEnhance.Contrast(processed_image)
            processed_image = enhancer.enhance(contrast)
            operations.append(f"对比度调整: {contrast:.1f}")
        
        # 生成处理报告
        info = f"""
🎨 图像处理完成！

📊 处理信息：
• 原始尺寸：{image.size[0]} × {image.size[1]}
• 图像模式：{image.mode}
• 处理时间：{datetime.datetime.now().strftime('%H:%M:%S')}

🔧 应用的操作：
{chr(10).join([f'• {op}' for op in operations])}

✨ 处理效果：
• 滤镜类型：{filter_type}
• 效果强度：{intensity}
• 亮度调整：{brightness:.1f}x
• 对比度调整：{contrast:.1f}x

💡 建议：
{random.choice([
    '图像处理效果良好，可以尝试其他滤镜',
    '建议适当调整亮度和对比度以获得更好效果',
    '可以组合多种滤镜创造独特风格',
    '处理后的图像质量优秀，适合分享使用'
])}
"""
        
        # 记录处理历史
        app_data["processing_history"].append({
            "type": "image_processing",
            "filter": filter_type,
            "timestamp": datetime.datetime.now().isoformat(),
            "size": f"{image.size[0]}x{image.size[1]}",
            "success": True
        })
        
        return processed_image, info
        
    except Exception as e:
        error_msg = f"❌ 图像处理错误：{str(e)}"
        return None, error_msg

def ai_content_generator(content_type, style, length, topic):
    """AI内容生成器"""
    update_stats("content_generated")
    
    try:
        # 内容模板库
        content_templates = {
            "创意文案": {
                "专业": [
                    "在数字化时代，{topic}正在重新定义我们的工作方式。通过创新的解决方案，我们能够实现更高效的协作和更优质的成果。",
                    "探索{topic}的无限可能，让技术成为推动进步的强大引擎。我们致力于为用户提供卓越的体验和价值。",
                    "面向未来的{topic}解决方案，融合了先进技术与人性化设计，为企业和个人创造更多机遇。"
                ],
                "轻松": [
                    "嘿！你知道{topic}有多酷吗？它就像是给生活加了个超级助手，让一切都变得简单有趣！",
                    "想象一下，如果{topic}是你的好朋友，它会怎样帮助你度过每一天？答案可能会让你惊喜！",
                    "关于{topic}，我有个小秘密要告诉你...它其实比你想象的更有趣、更实用！"
                ],
                "诗意": [
                    "如春风拂过心田，{topic}悄然改变着我们的世界。在这个充满可能的时代，每一次创新都如星辰般闪耀。",
                    "{topic}，如一首未完成的诗，等待着我们用心灵的笔触完成。在梦想与现实的交织处，我们发现了无限可能。",
                    "当晨曦初现，{topic}如同一缕光芒，照亮了前行的道路。在这个旅程中，我们不断探索，不断发现。"
                ]
            },
            "产品描述": {
                "专业": [
                    "这款高性能{topic}产品采用了最新技术，提供卓越的用户体验和无与伦比的性能。其精心设计的功能满足了专业用户的各种需求。",
                    "{topic}系列产品代表了行业的最高标准，融合了创新设计与实用功能。每一个细节都经过精心打磨，确保最佳性能。",
                    "我们的{topic}解决方案为企业提供了全方位的支持，从基础设施到高级功能，全面满足现代商业环境的复杂需求。"
                ],
                "轻松": [
                    "这个超赞的{topic}简直是日常生活的救星！它不仅好用，还特别有趣，绝对能让你爱不释手！",
                    "遇见我们的{topic}，就像交到了一个超级实用的新朋友！它懂你的需求，随时准备给你惊喜！",
                    "这款{topic}绝对是你没想到自己需要，但用过就离不开的神器！简单、有趣、实用，一次满足你所有期待！"
                ],
                "诗意": [
                    "如同晨曦中的露珠，我们的{topic}产品闪耀着纯净的光芒。每一次使用，都是一次心灵与科技的完美邂逅。",
                    "我们的{topic}，不仅仅是一件产品，更是一首献给生活的诗。在繁忙的都市中，它为你创造一方宁静与美好。",
                    "当星光洒落，{topic}如同夜空中的北斗，指引着你找到生活的平衡与和谐。这不仅是产品，更是生活的艺术。"
                ]
            },
            "故事创作": {
                "专业": [
                    "在一个技术飞速发展的时代，{topic}成为了改变命运的关键。主人公通过不懈努力和专业知识，最终克服了重重困难，实现了突破。",
                    "这是一个关于{topic}如何改变行业格局的故事。从最初的质疑到最终的认可，这个过程展现了创新精神的力量。",
                    "在商业世界的激烈竞争中，{topic}成为了决定成败的关键因素。这个案例研究展示了如何利用专业知识取得成功。"
                ],
                "轻松": [
                    "从前有个人对{topic}特别好奇，结果一不小心发现了一个超级有趣的秘密！接下来发生的事情，连他自己都惊呆了！",
                    "在一个阳光明媚的日子，我和{topic}来了个偶然的相遇。谁能想到，这次相遇会带来这么多欢乐和惊喜呢？",
                    "关于{topic}的搞笑冒险开始了！主角一路上遇到各种意想不到的状况，每一次都让人忍俊不禁！"
                ],
                "诗意": [
                    "在那个被遗忘的角落，{topic}如同一盏明灯，照亮了主人公迷失的心灵。这是一个关于寻找与救赎的故事，如诗如画。",
                    "当月光洒在古老的{topic}上，一段跨越时空的奇妙旅程悄然展开。在梦与现实的交界处，主人公发现了生命的真谛。",
                    "她与{topic}的相遇，如同春风与花朵的邂逅，美丽而短暂。这个故事讲述了生命中那些珍贵而易逝的瞬间。"
                ]
            }
        }
        
        # 根据内容类型、风格和主题选择模板
        templates = content_templates.get(content_type, {}).get(style, [])
        if not templates:
            return "❌ 无法生成内容：不支持的内容类型或风格", ""
        
        # 选择模板并填充主题
        template = random.choice(templates)
        content = template.replace("{topic}", topic)
        
        # 根据长度调整内容
        if length == "短":
            # 保持原样或截断
            if len(content) > 100:
                content = content[:100] + "..."
        elif length == "中":
            # 如果内容太短，重复一次
            if len(content) < 100:
                content = content + " " + content
        elif length == "长":
            # 重复内容以增加长度
            content = content + "\n\n" + content.replace(topic, "这个主题") + "\n\n" + content.replace(topic, "它")
        
        # 添加格式化和装饰
        if content_type == "创意文案":
            formatted_content = f"""
# ✨ 创意文案：{topic}

{content}

---
*风格：{style} | 生成时间：{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
        elif content_type == "产品描述":
            formatted_content = f"""
# 🛍️ 产品描述：{topic}

{content}

## 产品亮点
- 创新设计，引领潮流
- 卓越性能，稳定可靠
- 用户体验，简单直观
- 持久品质，值得信赖

---
*风格：{style} | 生成时间：{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
        elif content_type == "故事创作":
            formatted_content = f"""
# 📖 故事：{topic}的奇妙冒险

{content}

---
*风格：{style} | 生成时间：{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
        
        # 生成统计信息
        stats = f"""
📊 内容生成统计：
• 内容类型：{content_type}
• 风格：{style}
• 长度：{length} ({len(content)} 字符)
• 主题：{topic}
• 生成时间：{datetime.datetime.now().strftime('%H:%M:%S')}
"""
        
        # 记录生成历史
        app_data["generated_content"].append({
            "type": content_type,
            "style": style,
            "topic": topic,
            "timestamp": datetime.datetime.now().isoformat(),
            "length": len(content)
        })
        
        return formatted_content, stats
        
    except Exception as e:
        error_msg = f"❌ 内容生成错误：{str(e)}"
        return error_msg, "❌ 生成失败"

def data_visualization_creator(chart_type, data_source, color_theme):
    """数据可视化创建器"""
    try:
        # 根据数据源生成数据
        if data_source == "随机数据":
            categories = ['类别A', '类别B', '类别C', '类别D', '类别E']
            values = [random.randint(10, 100) for _ in range(5)]
            x = np.linspace(0, 10, 50)
            y1 = np.sin(x) * random.uniform(1, 3)
            y2 = np.cos(x) * random.uniform(1, 3)
        elif data_source == "用户统计":
            categories = ['文本处理', '图像处理', '内容生成', '其他操作']
            values = [
                app_data["user_stats"].get("text_processed", 0),
                app_data["user_stats"].get("images_processed", 0),
                app_data["user_stats"].get("content_generated", 0),
                app_data["user_stats"].get("total_operations", 0) - 
                app_data["user_stats"].get("text_processed", 0) - 
                app_data["user_stats"].get("images_processed", 0) - 
                app_data["user_stats"].get("content_generated", 0)
            ]
            x = np.linspace(0, 10, len(app_data["processing_history"]))
            y1 = np.array([i for i in range(len(app_data["processing_history"]))])
            y2 = np.array([i*0.8 for i in range(len(app_data["processing_history"]))])
        elif data_source == "示例数据":
            categories = ['产品A', '产品B', '产品C', '产品D', '产品E']
            values = [65, 42, 78, 30, 55]
            x = np.linspace(0, 10, 50)
            y1 = np.sin(x) * 2 + 5
            y2 = np.cos(x) * 1.5 + 3
        
        # 设置颜色主题
        if color_theme == "天空蓝":
            colors = ['#1E90FF', '#00BFFF', '#87CEEB', '#4169E1', '#87CEFA']
            line_colors = ['#1E90FF', '#4169E1']
        elif color_theme == "活力橙":
            colors = ['#FF7F50', '#FFA07A', '#FF6347', '#FF4500', '#FF8C00']
            line_colors = ['#FF7F50', '#FF4500']
        elif color_theme == "自然绿":
            colors = ['#2E8B57', '#3CB371', '#90EE90', '#32CD32', '#228B22']
            line_colors = ['#2E8B57', '#32CD32']
        elif color_theme == "梦幻紫":
            colors = ['#9370DB', '#8A2BE2', '#9932CC', '#BA55D3', '#DDA0DD']
            line_colors = ['#9370DB', '#8A2BE2']
        
        plt.figure(figsize=(10, 6))
        plt.style.use('seaborn-v0_8-whitegrid')
        
        # 创建指定类型的图表
        if chart_type == "柱状图":
            bars = plt.bar(categories, values, color=colors[:len(categories)])
            plt.title('📊 数据柱状图', fontsize=16, fontweight='bold')
            plt.xlabel('类别', fontsize=12)
            plt.ylabel('数值', fontsize=12)
            
            # 添加数值标签
            for bar, value in zip(bars, values):
                plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
                        str(value), ha='center', va='bottom', fontweight='bold')
        
        elif chart_type == "折线图":
            plt.plot(x, y1, color=line_colors[0], linewidth=2, marker='o', markersize=5, label='数据系列1')
            plt.plot(x, y2, color=line_colors[1], linewidth=2, marker='s', markersize=5, label='数据系列2')
            plt.title('📈 数据趋势图', fontsize=16, fontweight='bold')
            plt.xlabel('时间', fontsize=12)
            plt.ylabel('数值', fontsize=12)
            plt.legend()
        
        elif chart_type == "饼图":
            plt.pie(values, labels=categories, autopct='%1.1f%%', startangle=90, colors=colors[:len(categories)])
            plt.title('🥧 数据分布图', fontsize=16, fontweight='bold')
            plt.axis('equal')  # 保持饼图为圆形
        
        elif chart_type == "面积图":
            plt.fill_between(x, y1, alpha=0.5, color=line_colors[0], label='数据系列1')
            plt.fill_between(x, y2, alpha=0.5, color=line_colors[1], label='数据系列2')
            plt.title('📊 数据面积图', fontsize=16, fontweight='bold')
            plt.xlabel('时间', fontsize=12)
            plt.ylabel('数值', fontsize=12)
            plt.legend()
        
        # 美化图表
        plt.grid(True, alpha=0.3, linestyle='--')
        plt.tight_layout()
        
        # 生成图表说明
        chart_info = f"""
📊 数据可视化信息

🎨 图表类型：{chart_type}
📋 数据来源：{data_source}
🎭 颜色主题：{color_theme}
📈 数据点数：{len(values) if chart_type in ["柱状图", "饼图"] else len(x)}
📊 数值范围：{min(values)} - {max(values) if chart_type in ["柱状图", "饼图"] else f"{min(y1)} - {max(y1)}"}
⏰ 生成时间：{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

💡 图表解读：
{random.choice([
    '数据呈现明显的分布差异，重点关注最高值和最低值的差距',
    '数据趋势表现出周期性变化，可能受季节性因素影响',
    '各类别之间存在明显的比例关系，主要类别占据主导地位',
    '数据序列之间存在一定的相关性，可进一步分析其关联因素'
])}
"""
        
        return plt, chart_info
        
    except Exception as e:
        error_msg = f"❌ 图表生成错误：{str(e)}"
        plt.figure(figsize=(10, 6))
        plt.text(0.5, 0.5, error_msg, ha='center', va='center', fontsize=14, color='red')
        plt.tight_layout()
        return plt, "❌ 图表生成失败"

def collect_user_feedback(name, email, rating, category, feedback_text):
    """收集用户反馈"""
    try:
        feedback_data = {
            "name": name,
            "email": email,
            "rating": rating,
            "category": category,
            "feedback": feedback_text,
            "timestamp": datetime.datetime.now().isoformat(),
            "id": len(app_data["user_feedback"]) + 1
        }
        
        app_data["user_feedback"].append(feedback_data)
        
        # 打印到服务器日志（实际应用中会保存到数据库）
        print(f"收到用户反馈：{json.dumps(feedback_data, ensure_ascii=False, indent=2)}")
        
        # 仅输入模式：不返回任何内容
        return None
    except Exception as e:
        print(f"处理反馈时出错：{str(e)}")
        return None

def get_app_statistics():
    """获取应用统计信息"""
    try:
        # 计算基本统计数据
        total_operations = app_data["user_stats"]["total_operations"]
        text_processed = app_data["user_stats"]["text_processed"]
        images_processed = app_data["user_stats"]["images_processed"]
        content_generated = app_data["user_stats"]["content_generated"]
        
        # 计算反馈统计
        feedback_count = len(app_data["user_feedback"])
        avg_rating = 0
        if feedback_count > 0:
            avg_rating = sum(item["rating"] for item in app_data["user_feedback"]) / feedback_count
        
        # 生成统计报告
        stats_report = f"""
# 📊 应用统计报告

## 📈 使用统计
- **总操作次数**：{total_operations}
- **文本处理**：{text_processed} 次 ({text_processed/total_operations*100:.1f}% 如果有操作)
- **图像处理**：{images_processed} 次 ({images_processed/total_operations*100:.1f}% 如果有操作)
- **内容生成**：{content_generated} 次 ({content_generated/total_operations*100:.1f}% 如果有操作)

## 💬 反馈统计
- **收到反馈**：{feedback_count} 条
- **平均评分**：{avg_rating:.1f}/5 (如果有反馈)
- **最新反馈**：{app_data["user_feedback"][-1]["category"] if feedback_count > 0 else "暂无反馈"}

## ⏰ 系统信息
- **当前时间**：{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- **会话开始**：{datetime.datetime.now().strftime('%Y-%m-%d')}
- **系统状态**：✅ 正常运行中

## 🔍 详细分析
- **最常用功能**：{'文本处理' if text_processed >= images_processed and text_processed >= content_generated else '图像处理' if images_processed >= text_processed and images_processed >= content_generated else '内容生成'}
- **使用趋势**：{'稳定增长' if total_operations > 5 else '初始阶段'}
"""
        
        return stats_report
    except Exception as e:
        error_msg = f"❌ 统计生成错误：{str(e)}"
        return error_msg

# 创建应用界面
with gr.Blocks(title="🌟 天空蓝智能应用平台", css=custom_css) as demo:
    gr.HTML("""
    <div style="text-align: center; margin-bottom: 20px;">
        <h1 class="main-title">🌟 天空蓝智能应用平台</h1>
        <p style="color: white; font-size: 1.2em; margin-top: -10px;">
            集成多种智能功能的现代化Web应用
        </p>
    </div>
    """)
    
    with gr.Tabs():
        # 文本处理标签页
        with gr.TabItem("📝 智能文本处理"):
            gr.Markdown("### 🔍 高级文本分析与处理")
            
            with gr.Row():
                with gr.Column():
                    text_input = gr.Textbox(
                        label="📝 输入文本",
                        placeholder="在这里输入要处理的文本...",
                        lines=5
                    )
                    
                    with gr.Row():
                        text_operation = gr.Radio(
                            label="🔧 处理操作",
                            choices=["智能分析", "内容优化", "关键词提取", "情感分析"],
                            value="智能分析"
                        )
                        
                        with gr.Column():
                            case_option = gr.Dropdown(
                                label="🔤 大小写选项",
                                choices=["保持原样", "全部大写", "全部小写", "首字母大写"],
                                value="保持原样"
                            )
                            
                            word_limit = gr.Slider(
                                label="📏 字数限制",
                                minimum=0,
                                maximum=500,
                                value=0,
                                step=10,
                                info="0表示无限制"
                            )
                    
                    text_process_btn = gr.Button("🔄 处理文本", variant="primary")
                
                with gr.Column():
                    text_output = gr.Markdown(label="📊 处理结果")
                    text_stats = gr.Textbox(label="📈 处理统计", lines=1)
            
            text_process_btn.click(
                advanced_text_processor,
                inputs=[text_input, text_operation, case_option, word_limit],
                outputs=[text_output, text_stats]
            )
            
            gr.Markdown("""
            ### 💡 文本处理功能说明
            
            - **智能分析**：对文本进行全面分析，包括字数统计、句子分析和内容评估
            - **内容优化**：自动优化文本格式和表达，提升可读性
            - **关键词提取**：识别并提取文本中的关键词和重要概念
            - **情感分析**：分析文本的情感倾向，判断积极、消极或中性
            
            **提示**：尝试不同的处理操作和选项组合，探索更多可能性！
            """)
        
        # 图像处理标签页
        with gr.TabItem("🖼️ 智能图像处理"):
            gr.Markdown("### 🎨 高级图像滤镜与效果")
            
            with gr.Row():
                with gr.Column():
                    image_input = gr.Image(
                        label="🖼️ 上传图像",
                        type="pil",
                        info="支持JPG、PNG等常见格式"
                    )
                    
                    with gr.Row():
                        filter_type = gr.Dropdown(
                            label="🎭 滤镜类型",
                            choices=["艺术风格", "梦幻模糊", "锐化增强", "边缘检测", "复古怀旧", "黑白经典"],
                            value="艺术风格"
                        )
                        
                        intensity = gr.Slider(
                            label="💪 效果强度",
                            minimum=1,
                            maximum=10,
                            value=5,
                            step=1
                        )
                    
                    with gr.Row():
                        brightness = gr.Slider(
                            label="☀️ 亮度调整",
                            minimum=0.1,
                            maximum=2.0,
                            value=1.0,
                            step=0.1
                        )
                        
                        contrast = gr.Slider(
                            label="🌓 对比度调整",
                            minimum=0.1,
                            maximum=2.0,
                            value=1.0,
                            step=0.1
                        )
                    
                    image_process_btn = gr.Button("🎨 处理图像", variant="primary")
                
                with gr.Column():
                    image_output = gr.Image(label="🖼️ 处理结果")
                    image_info = gr.Markdown(label="📋 处理信息")
            
            image_process_btn.click(
                smart_image_processor,
                inputs=[image_input, filter_type, intensity, brightness, contrast],
                outputs=[image_output, image_info]
            )
            
            gr.Markdown("""
            ### 💡 图像处理功能说明
            
            - **艺术风格**：应用艺术效果，创造独特视觉风格
            - **梦幻模糊**：添加柔和的模糊效果，营造梦幻氛围
            - **锐化增强**：增强图像细节和清晰度
            - **边缘检测**：突出显示图像中的边缘和轮廓
            - **复古怀旧**：添加复古风格，营造怀旧氛围
            - **黑白经典**：将图像转换为经典黑白效果
            
            **提示**：调整亮度和对比度可以进一步优化处理效果！
            """)
        
        # 内容生成标签页
        with gr.TabItem("✨ AI内容生成"):
            gr.Markdown("### 🤖 智能内容创作助手")
            
            with gr.Row():
                with gr.Column():
                    content_type = gr.Radio(
                        label="📋 内容类型",
                        choices=["创意文案", "产品描述", "故事创作"],
                        value="创意文案"
                    )
                    
                    style = gr.Radio(
                        label="🎭 风格选择",
                        choices=["专业", "轻松", "诗意"],
                        value="专业"
                    )
                    
                    with gr.Row():
                        length = gr.Dropdown(
                            label="📏 内容长度",
                            choices=["短", "中", "长"],
                            value="中"
                        )
                        
                        topic = gr.Textbox(
                            label="🎯 主题关键词",
                            placeholder="输入主题关键词...",
                            value="人工智能"
                        )
                    
                    generate_btn = gr.Button("✨ 生成内容", variant="primary")
                
                with gr.Column():
                    generated_content = gr.Markdown(label="📝 生成内容")
                    generation_stats = gr.Textbox(label="📊 生成统计", lines=5)
            
            generate_btn.click(
                ai_content_generator,
                inputs=[content_type, style, length, topic],
                outputs=[generated_content, generation_stats]
            )
            
            gr.Markdown("""
            ### 💡 内容生成功能说明
            
            - **创意文案**：生成吸引人的营销文案和创意内容
            - **产品描述**：创建专业的产品介绍和特点描述
            - **故事创作**：生成有趣的短篇故事和叙事内容
            
            **风格选择**：
            - **专业**：正式、专业的语言风格，适合商业场景
            - **轻松**：活泼、轻松的语言风格，适合社交媒体
            - **诗意**：优美、富有诗意的语言风格，适合文学创作
            
            **提示**：尝试不同的主题关键词和风格组合，探索更多创意可能！
            """)
        
        # 数据可视化标签页
        with gr.TabItem("📊 数据可视化"):
            gr.Markdown("### 📈 智能图表生成器")
            
            with gr.Row():
                with gr.Column():
                    chart_type = gr.Radio(
                        label="📊 图表类型",
                        choices=["柱状图", "折线图", "饼图", "面积图"],
                        value="柱状图"
                    )
                    
                    with gr.Row():
                        data_source = gr.Dropdown(
                            label="📋 数据来源",
                            choices=["随机数据", "用户统计", "示例数据"],
                            value="随机数据"
                        )
                        
                        color_theme = gr.Dropdown(
                            label="🎨 颜色主题",
                            choices=["天空蓝", "活力橙", "自然绿", "梦幻紫"],
                            value="天空蓝"
                        )
                    
                    chart_btn = gr.Button("📊 生成图表", variant="primary")
                
                with gr.Column():
                    chart_output = gr.Plot(label="📈 数据图表")
                    chart_info = gr.Markdown(label="📋 图表信息")
            
            chart_btn.click(
                data_visualization_creator,
                inputs=[chart_type, data_source, color_theme],
                outputs=[chart_output, chart_info]
            )
            
            gr.Markdown("""
            ### 💡 数据可视化功能说明
            
            - **柱状图**：展示不同类别之间的数值比较
            - **折线图**：展示数据随时间或顺序的变化趋势
            - **饼图**：展示部分与整体的比例关系
            - **面积图**：展示累积趋势和数据范围
            
            **数据来源**：
            - **随机数据**：生成随机测试数据
            - **用户统计**：使用当前应用的使用统计数据
            - **示例数据**：使用预设的示例数据集
            
            **提示**：尝试不同的图表类型和颜色主题，找到最适合您数据的可视化方式！
            """)
        
        # 反馈与统计标签页
        with gr.TabItem("📋 反馈与统计"):
            with gr.Tabs():
                # 用户反馈子标签页
                with gr.TabItem("💬 提交反馈"):
                    gr.Markdown("### 📝 我们重视您的意见")
                    
                    with gr.Row():
                        with gr.Column():
                            feedback_name = gr.Textbox(
                                label="👤 您的姓名",
                                placeholder="请输入您的姓名（可选）"
                            )
                            
                            feedback_email = gr.Textbox(
                                label="📧 电子邮箱",
                                placeholder="请输入您的邮箱（可选）"
                            )
                        
                        with gr.Column():
                            feedback_rating = gr.Slider(
                                label="⭐ 满意度评分",
                                minimum=1,
                                maximum=5,
                                value=5,
                                step=1,
                                info="1=非常不满意，5=非常满意"
                            )
                            
                            feedback_category = gr.Dropdown(
                                label="📂 反馈类别",
                                choices=["功能建议", "问题报告", "使用体验", "其他"],
                                value="功能建议"
                            )
                    
                    feedback_text = gr.Textbox(
                        label="💭 反馈内容",
                        placeholder="请详细描述您的反馈、建议或问题...",
                        lines=5
                    )
                    
                    feedback_btn = gr.Button("📤 提交反馈", variant="primary")
                    
                    # 仅输入模式：无输出组件
                    feedback_btn.click(
                        collect_user_feedback,
                        inputs=[feedback_name, feedback_email, feedback_rating, feedback_category, feedback_text],
                        outputs=None
                    )
                    
                    gr.Markdown("""
                    ### 💡 感谢您的反馈！
                    
                    您的反馈对我们非常重要，它将帮助我们不断改进和优化应用体验。
                    我们会认真考虑每一条建议，并努力解决您遇到的问题。
                    
                    **提示**：如果您提供了电子邮箱，我们可能会就您的反馈进行后续沟通。
                    """)
                
                # 应用统计子标签页
                with gr.TabItem("📊 应用统计"):
                    gr.Markdown("### 📈 使用数据统计")
                    
                    stats_btn = gr.Button("🔄 刷新统计", variant="secondary")
                    stats_output = gr.Markdown(label="📊 统计报告")
                    
                    stats_btn.click(
                        get_app_statistics,
                        outputs=stats_output
                    )
                    
                    gr.Markdown("""
                    ### 💡 统计信息说明
                    
                    这里展示了应用的使用统计数据，包括：
                    
                    - **使用统计**：各功能的使用次数和比例
                    - **反馈统计**：用户反馈数量和评分情况
                    - **系统信息**：当前时间和系统状态
                    - **详细分析**：使用趋势和最常用功能
                    
                    **提示**：点击"刷新统计"按钮获取最新的统计数据！
                    """)
    
    gr.Markdown("""
    ## 🌟 天空蓝智能应用平台
    
    这是一个集成多种智能功能的现代化Web应用，包括文本处理、图像处理、内容生成和数据可视化等功能。
    
    ### ✨ 主要功能
    
    - **📝 智能文本处理**：分析、优化和处理文本内容
    - **🖼️ 智能图像处理**：应用各种滤镜和效果处理图像
    - **✨ AI内容生成**：创建各种类型的创意内容
    - **📊 数据可视化**：生成直观的数据图表
    - **📋 反馈与统计**：提交反馈并查看使用统计
    
    ### 💡 使用提示
    
    - 尝试不同的功能组合，探索更多可能性
    - 提交反馈帮助我们改进应用体验
    - 定期查看统计数据了解您的使用情况
    
    ### 🔧 技术支持
    
    如需帮助或有任何问题，请通过反馈表单联系我们。
    
    ---
    
    © 2024 天空蓝智能应用平台 | 版本 1.0.0 | 最后更新：2024年6月
    """)

if __name__ == "__main__":
    demo.launch()
