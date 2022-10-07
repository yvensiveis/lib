const fs = require('fs')
const path = require('path')

let tex_doc_text = ''
let readme_text = ''

const settings_path = path.join('settings.json')
const settings = JSON.parse(fs.readFileSync(settings_path))

const title = settings.title || 'Library'
const author = settings.author || ''
const code_languages = settings.code_languages || {}

tex_doc_text += `\\title{${title}}\n`
tex_doc_text += `\\author{${author}}\n\n`

const head_path = path.join('.', 'tex', 'head.tex')
const head_text = fs.readFileSync(head_path, 'utf8') + '\n'
tex_doc_text += head_text

readme_text += `# ${title}\n\n`
const docs = path.join('.', 'docs', 'README.md')
readme_text += fs.readFileSync(docs, 'utf8') + '\n'

const format_title = (title) => {
    const arr = title.split('-')
    if (parseInt(arr[0]) == arr[0]) arr.shift()
    const formatted_title = arr.join(' ')
    return formatted_title
}

const format_path = (path_to_format) => {
    const formatted_path = path_to_format.replace(' ', '%20')
    return formatted_path
}

const format_section_tex = (title, depth) => {
    if (depth <= 2) {
        let text = '\\'
        for (let i = 0; i < depth; ++i) text += 'sub'
        text += `section{${format_title(title)}}\n\n`
        return text
    } else {
        return `\\textbf{${format_title(title)}}\n\n`
    }
}

const format_section_readme = (title, section_path, depth) => {
    let text = ''
    if (depth == 0) text += '\n##'
    else {
        for (let i = 1; i < depth; ++i) text += '    '
        text += '*'
    }
    text += ` [${format_title(title)}](${format_path(section_path)})\n`
    if (depth == 0) text += '\n'
    return text
}

const build_dir = (dir, depth) => {
    const content = fs.readdirSync(dir)
    content.forEach((child) => {
        const child_path = path.join(dir, child)
        const stats = fs.lstatSync(child_path)
        if (stats.isFile()) {
            const ext = path.extname(child_path)
            
            const file_text = fs.readFileSync(child_path, 'utf8') + '\n'

            if (ext == '.tex') {
                readme_text += format_section_readme(child, child_path, depth)
                tex_doc_text += file_text
            } else if (code_languages[ext]) {
                tex_doc_text += format_section_tex(child, depth)
                readme_text += format_section_readme(child, child_path, depth)
                const language = code_languages[ext]
                tex_doc_text += `\\begin{lstlisting}[language=${language}, numbers=none]\n`
                tex_doc_text += file_text
                tex_doc_text += '\\end{lstlisting}\n\n'
            }
        } else if (stats.isDirectory()) {
            tex_doc_text += format_section_tex(child, depth)
            readme_text += format_section_readme(child, child_path, depth)
            build_dir(child_path, depth + 1)
        }
    })
}

const lib_path = path.join('.', 'lib')
build_dir(lib_path, 0)

const tail_path = path.join('.', 'tex', 'tail.tex')
const tail_text = fs.readFileSync(tail_path, 'utf8') + '\n'
tex_doc_text += tail_text

const build_path = path.join('.', 'build')
if (!fs.existsSync(build_path)) fs.mkdirSync(build_path)
const tex_doc_path = path.join(build_path, 'main.tex')
fs.writeFileSync(tex_doc_path, tex_doc_text, { encoding: 'utf8' })

const readme_path = path.join('.', 'README.md')
fs.writeFileSync(readme_path, readme_text, { encoding: 'utf8' })
