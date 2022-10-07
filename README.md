# Library Template

## How to use the template

1. Config lib in [settings.json](./settings.json):

    `settings.json` (example)
    ```json
    {
        "title": "My Competitive Programming Library",
        "author": "Me",
        "code_languages": {
            ".c": "C",
            ".cpp": "C++",
            ".py": "Python",
            ".java": "Java"
        }
    }
    ```
    `title` and `author` will be used to generate the LaTeX document. `title`
    will also be used to generate the `README.md`. In `code_languages`, each
    extension must be associated to a
    [language supported by LaTeX code listing](https://www.overleaf.com/learn/latex/Code_listing#Supported_languages).

2. Change lib description at [docs/README.md](./docs/README.md):

    `docs/README.md` (example)
    ```md
    Description of my lib. It goes on the head of `README.md`.
    ```

3. Create the lib files inside [lib directory](./lib).

    `.tex` files can be created to insert LaTeX code directly into the document. Files with other extensions will be listed as code and their extensions must be set in `code_languages` in [settings.json](./settings.json). Check [Yvensíveis' lib](https://github.com/yvensiveis/lib) to see an example.

4. Build the lib `README.md` and LaTeX document file using [NodeJS](https://nodejs.org/en/).

    Install NodeJS and run:
    ```sh
    node build.js
    ```

    The `README.md` will be updated in the root directory and the LaTeX document will be created at `build/main.tex`.
