import api from './api'

class App {
    constructor() {
        this.repositories = [];
        this.formEl = document.getElementById('repo-form')
        this.listEl = document.getElementById('repo-list')
        this.inputEl = document.querySelector('input[name=repository]')
        this.registerHandlers();
    }

    setLoading(loading = true){
        if (loading == true){
            let loadingEl = document.createElement('span')
            loadingEl.appendChild(document.createTextNode('Carregando'))
            loadingEl.setAttribute('id', 'loading')

            this.formEl.appendChild(loadingEl)
        }
        else document.getElementById('loading').remove()
    }

    registerHandlers() {
        console.log("registerHandlers")
        console.log(this.formEl)
        this.formEl.onsubmit = event => this.addRepository(event)
    }

    async addRepository(event) {
        console.log("addRepository")
        this.setLoading();
        event.preventDefault()

        const repoInput = this.inputEl.value

        if (repoInput.length == 0) return;

        try{
            const response = await api.get(`/users/${repoInput}`)

            console.log(response)
            const { name, description, bio, html_url, avatar_url, repos_url } = response.data

            this.repositories.push({
                name,
                description: description || bio || 'Não possui descrição',
                avatar_url,
                repos_url,
                html_url
            })

            this.inputEl.value = ''

            this.render();
        }
        catch(err){
            alert('O repositório não existe!')
        }
        this.setLoading(false)
    }

    render() {
        this.listEl.innerHTML = '';
        this.repositories.forEach(repo => {

            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url)

            let titleEl = document.createElement('strong')
            titleEl.appendChild(document.createTextNode(repo.name))

            let descriptionEl = document.createElement('p')
            descriptionEl.appendChild(document.createTextNode(repo.description))

            let linkEl = document.createElement('a')
            linkEl.setAttribute('target', '_blank')
            linkEl.setAttribute('href', repo.html_url)
            linkEl.appendChild(document.createTextNode('Acessar Perfil'))

            let auxEl = document.createElement('p')

            let repoEl = document.createElement('a')
            repoEl.setAttribute('target', '_blank')
            repoEl.setAttribute('href', repo.repo_url)
            repoEl.appendChild(document.createTextNode('Acessar Repositórios'))

            let listItemEl = document.createElement('li')
            listItemEl.appendChild(imgEl)
            listItemEl.appendChild(titleEl)
            listItemEl.appendChild(descriptionEl)
            listItemEl.appendChild(linkEl)
            listItemEl.appendChild(auxEl)
            listItemEl.appendChild(repoEl)

            this.listEl.appendChild(listItemEl)
        })
    }
}

new App();