const Main = {

    tasks: [],

    init : function() {
        this.cacheSelectors()
        this.bindEvents()
        this.getStorage()
        this.buildTasks()
    },

    cacheSelectors: function() {
        this.$checkButtons = document.querySelectorAll('.check')
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')
    },

    bindEvents: function () {
        const self = this

        this.$checkButtons.forEach(function(button){
            button.onclick = self.Events.checkButton_click
        })

        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

        this.$removeButtons.forEach(function(button){
            button.onclick = self.Events.removeButtons_click.bind(self)
        })
    },

    getStorage: function() {
        const tasks = localStorage.getItem('tasks')

        if (tasks) {
        this.tasks = JSON.parse(tasks)
        } else {
            localStorage.setItem('tasks', JSON.stringify([]))
        }
    },

    getTaskHtml : function(task, isDone) {
        return `
            <li>
                <div class="check"></div>
                <label class="task">
                    ${task}
                </label>
                <button class="remove" data-task="${task}"></button>
            </li>
        `
    },

    buildTasks: function() {
        let html = ''
        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task)
         })

         this.$list.innerHTML = html

         this.cacheSelectors()
         this.bindEvents()
    },



    Events: {
        checkButton_click: function(e) {
            const li = e.target.parentElement
            const isDone = li.classList.contains('done')

            if(!isDone) {
                return li.classList.add('done')
            }

            li.classList.remove('done')    
        },

        inputTask_keypress: function(e) {
            const key = e.key
            const value = e.target.value
            const isDone = false

            if (key === 'Enter') {
                const taskHtml = this.getTaskHtml(value, isDone)

                this.insertHTML(this.$list, taskHtml)

                e.target.value = ''

                this.cacheSelectors()
                this.bindEvents()

                const savedTasks = localStorage.getItem('tasks')
                const savedTasksArr = JSON.parse(savedTasks)

                const arrTasks = [
                    {task: value},
                    ...savedTasksArr,
                ]

                const jsonTasks = JSON.stringify(arrTasks)

                this.tasks = arrTasks
                localStorage.setItem('tasks', jsonTasks)
            }
        },

        removeButtons_click: function(e) {
            const li = e.target.parentElement
            const value = e.target.dataset['task']

            const newTasksState = this.tasks.filter(item => {
                console.log(item.task, value)
                return item.task !== value
            })

            localStorage.setItem('tasks', JSON.stringify(newTasksState))
            this.tasks = newTasksState

            li.classList.add('removed')

            setTimeout(function(){
                li.classList.add('hidden')
            },300)
        }
    }
}

Main.init()