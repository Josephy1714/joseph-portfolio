from django.shortcuts import render

def get_offsets(word_lists, base_delay=0.2):
    offsets = []
    total_words = 0
    for words in word_lists:
        offsets.append(round(total_words * base_delay, 1))
        total_words += len(words)
    return offsets

def home(request):
    name_words = "Joseph Ombati".split()
    role_words = "Data Scientist & Python Developer (Nairobi, Kenya)".split()
    tagline_words = "Solving problems with precision, ethics, and automation.".split()

    offsets = get_offsets([name_words, role_words, tagline_words])
    name_offset, role_offset, tagline_offset = offsets

    return render(request, 'showcase/home.html', {
        'name_words': name_words,
        'role_words': role_words,
        'tagline_words': tagline_words,
        'name_offset': name_offset,
        'role_offset': role_offset,
        'tagline_offset': tagline_offset,
    })

def about(request):
    heading_words = "About Me".split()
    para1_words = "I'm a data science student passionate about ethical automation and creative problem-solving.".split()
    para2_words = "I build Python tools and cinematic web experiences that blend logic with visual storytelling.".split()

    offsets = get_offsets([heading_words, para1_words, para2_words])
    heading_offset, para1_offset, para2_offset = offsets

    return render(request, 'showcase/about.html', {
        'heading_words': heading_words,
        'para1_words': para1_words,
        'para2_words': para2_words,
        'heading_offset': heading_offset,
        'para1_offset': para1_offset,
        'para2_offset': para2_offset,
    })

def projects(request):
    heading1_words = "Telegram Bot".split()
    project1_words = "Automates data collection and alerts using Python and Telegram API.".split()
    heading2_words = "Portfolio Website".split()
    project2_words = "Cinematic Django site with animated text, glowing buttons, and modular design.".split()
    heading3_words = "Data Ethics Dashboard".split()
    project3_words = "Visualizes ethical metrics and workflow transparency using Pandas and Matplotlib.".split()

    offsets = get_offsets([
        heading1_words, project1_words,
        heading2_words, project2_words,
        heading3_words, project3_words
    ])
    h1, p1, h2, p2, h3, p3 = offsets

    return render(request, 'showcase/projects.html', {
        'heading1_words': heading1_words,
        'project1_words': project1_words,
        'heading2_words': heading2_words,
        'project2_words': project2_words,
        'heading3_words': heading3_words,
        'project3_words': project3_words,
        'heading1_offset': h1,
        'project1_offset': p1,
        'heading2_offset': h2,
        'project2_offset': p2,
        'heading3_offset': h3,
        'project3_offset': p3,
    })

def contact(request):
    heading_words = "Contact Me".split()
    para1_words = "Feel free to reach out for collaborations, questions, or just to say hello.".split()
    para2_words = "I'm always excited to connect with fellow builders and data enthusiasts.".split()

    offsets = get_offsets([heading_words, para1_words, para2_words])
    heading_offset, para1_offset, para2_offset = offsets

    return render(request, 'showcase/contact.html', {
        'heading_words': heading_words,
        'para1_words': para1_words,
        'para2_words': para2_words,
        'heading_offset': heading_offset,
        'para1_offset': para1_offset,
        'para2_offset': para2_offset,
    })
