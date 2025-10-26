from django.shortcuts import render

def get_offsets(word_lists, base_delay=0.2):
    offsets = []
    total_words = 0
    for words in word_lists:
        offsets.append(round(total_words * base_delay, 1))
        total_words += len(words)
    return offsets

def home(request):
    return render(request, 'showcase/home.html', {
        'name_words': "Joseph Ombati".split(),
        'role_words': "Data Scientist & Python Developer (Nairobi, Kenya)".split(),
        'tagline_words': "Solving problems with precision, ethics, and automation.".split(),
        'line_offset': 0.2,
    })

def about(request):
    return render(request, 'showcase/about.html', {
        'heading_words': "About Me".split(),
        'para1_words': "I'm Joseph Ombati, a first-year Bachelor of Science in Data Science student based in Nairobi, Kenya. My academic journey is rooted in a deep curiosity about how data shapes the world and a determination to master the tools and thinking needed to turn raw information into meaningful insights.".split(),
        'para2_words': "At this early stage, I’m building a strong foundation in statistics, Python programming, and data ethics. I’m particularly drawn to the intersection of data science and automation, how we can design systems that not only analyze information but also act on it with precision and purpose. From writing clean, modular Python code to exploring the fundamentals of machine learning, I’m focused on developing the skills that will allow me to solve real-world problems with clarity and impact.".split(),
        'para3_words': "I’m also fascinated by the structure behind data workflows. I enjoy designing pipelines that are efficient, reproducible, and scalable—whether that means automating data collection, cleaning messy datasets, or visualizing patterns that weren’t obvious before. I believe that good data science is not just about models, but about thoughtful design, ethical responsibility, and clear communication.".split(),
        'para4_words': "Outside the classroom, I’m constantly experimenting. I build small projects to test what I’m learning—from benchmarking global pay rates to exploring how data can support community initiatives. I’m especially interested in how data science can be applied to social impact, education, and digital equity.".split(),
        'para5_words': "While I’m still early in my journey, I approach every challenge with persistence, humility, and a desire to understand deeply. I’m not just learning how to code—I’m learning how to think like a data scientist: to ask better questions, to test assumptions, and to build systems that make sense of complexity.".split(),
        'para6_words': "This is just the beginning, but I’m committed to growing into a data scientist who builds responsibly, communicates clearly, and solves problems that matter.".split(),
        'line_offset': 0.2,
    })

def projects(request):
    return render(request, 'showcase/projects.html', {
        'heading1_words': "Telegram Bot Automation".split(),
        'project1_words': "I built a Telegram bot using Python and the python-telegram-bot library. The bot automates reminders, tracks contributions, and sends personalized updates to members. This project taught me how to structure modular code, handle user input, and deploy a real-time automation tool that supports community engagement.".split(),

        'heading2_words': "Global Pay Benchmarking Dashboard".split(),
        'project2_words': "I designed a data pipeline to collect, clean, and visualize pay rate data across regions. Using Python, Pandas, and Matplotlib, I created a dashboard that highlights disparities and trends. This project deepened my understanding of data wrangling, exploratory analysis, and ethical data storytelling.".split(),

        'heading3_words': "Django-Based Portfolio Website (Full Stack Developer)".split(),
        'project3_words': "I built a personal portfolio using Django, HTML/CSS, and Bootstrap. The site features modular templates, animated content, and a responsive layout. It serves as both a learning lab and a showcase of my evolving skills in web development, design systems, and user experience.".split(),
        'line_offset': 0.2,
    })

def contact(request):
    return render(request, 'showcase/contact.html', {
        'heading_words': "Let’s Collaborate".split(),
        'para1_words': "If you're working on a data science project—whether it's automating workflows, analyzing complex datasets, or building intelligent systems—I’d love to connect. I’m especially passionate about using data to solve real-world problems and create meaningful impact.".split(),
        'para2_words': "You can reach me via email or message me directly on WhatsApp. I’m open to collaborations, freelance opportunities, or simply exchanging ideas with fellow data enthusiasts.".split(),
        'line_offset': 0.2,
    })
