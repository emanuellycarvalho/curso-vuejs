<template>
    <div id="main-div" class="container">
        <div id="symbols">
            <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </symbol>
                <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </symbol>
                <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </symbol>
            </svg>
        </div>
        <div id="page-header">
            <h1>Vue.js + Git</h1>
            <!-- <p>Buscando issues de um repositório do Git usando Vue.js!</p> -->
            <p>Searching for Git's repository's issues using Vue.js</p>
            <hr>
        </div>
        <div id="form">
            <form action="">
                <div class="row justify-content-center">
                    <div class="col-md-4">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">GitHub Username</span>
                            </div>
                            <input v-model="username" type="text" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">User's repository</span>
                            </div>
                            <input v-model="repository.name" type="text" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-2">
                        <button @click.prevent.stop="search()" class="btn btn-success">SEARCH</button>
                        <button @click.prevent.stop="clear()" class="btn btn-danger">CLEAR</button>
                    </div>
                </div>
            </form>
            <hr>
        </div>

        <div id="loader" v-if="table.loader" class="d-flex justify-content-center">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div id="issue" v-if="selectedIssue.show" class="row justify-content-center">
            <div class="col-10">
                <div class="card">
                    <div class="card-header">
                        <h5>{{ selectedIssue.content.title }}</h5>
                    </div>
                    <div class="card-body">
                        {{ selectedIssue.content.body }}
                    </div>
                    <div class="card-footer">
                        <div class="row justify-content-end">
                            <div class="col-2">
                                <button @click.prevent.stop="backToTable()" class="btn btn-primary">Back to table</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="table" v-if="table.show" class="row justify-content-center">
            <div class="col-md-10">
                <table class="table table-striped table-dark table-bordered table-hover">
                    <thead>
                        <tr>
                            <th class="col-sm-2"><center>Number</center></th>
                            <th class="col">Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="issue in issues" :key="issue.number">
                            <td>
                                <div class="row">
                                    <div class="col">
                                        <a @click.prevent.stop="select(issue)" href=""><center>{{ issue.number }}</center></a>
                                    </div>
                                    <div class="col">
                                        <div v-if="issue.is_loading" class="spinner-border spinner-border-sm text-light" role="status"></div>
                                    </div>
                                </div>
                            </td>
                            <td>{{ issue.title }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div id="alert" v-if="alert.show" class="row justify-content-center">
            <div class="col-md-10">
                <div class="alert alert-dark" role="alert">
                    <svg v-if="alert.icon == 'info'" class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
                    <svg v-if="alert.icon == 'warning'" class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                    <svg v-if="alert.icon == 'success'" class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
                    {{ alert.message }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'GitIssues',
        data(){
            return {
                username: '',
                issues: [],
                selectedIssue: {
                    loader: false,
                    show: false,
                    loader: false,
                    content: {}
                },
                repository: {
                    name: '',
                    link: ''
                },
                alert:{
                    message: '',
                    icon: '',
                    show: false,
                },
                table: {
                    show: false,
                    loader: false
                },
            }
        },
        methods:{
            search(){
                this.resetAlert();
                this.table.loader = true;
                this.table.show = false;
                
                if(!this.username || !this.repository.name){
                    this.alert.message = 'Please, fill the inputs correctly.';
                    this.alert.icon = 'warning'; 
                    this.alert.show = true;
                    this.table.loader = false;
                    return;
                }

                const url = `https://api.github.com/repos/${this.username}/${this.repository.name}/issues`;
                axios.get(url).then((response) => {
                    if(response.data.length > 0){
                        this.repository.link = `https://github.com/${this.username}/${this.repository.name}`;
                        this.issues = response.data;
                        this.table.show = true;
                        this.table.loader = false;
                        return;
                    }

                    this.alert.message = 'No issues were found here!';
                    this.alert.icon = 'success'; 
                    this.alert.show = true;

                })
                .catch((error) => {
                    this.alert.message = 'This repository was not found.';
                    this.alert.icon = 'warning'; 
                    this.alert.show = true; 
                })
                .finally(() => {
                    this.table.loader = false;
                });
            },

            select(issue){
                this.resetAlert();
                this.$set(issue, 'is_loading', true);
                this.selectedIssue.show = false;
                
                if(!this.username || !this.repository.name){
                    this.alert.message = 'Please, fill the inputs correctly.';
                    this.alert.icon = 'warning'; 
                    this.table.show = false;
                    this.alert.show = true;
                    return;
                }

                const url = `https://api.github.com/repos/${this.username}/${this.repository.name}/issues/${issue.number}`;
                axios.get(url).then((response) => {
                    this.repository.link = `https://github.com/${this.username}/${this.repository.name}`;
                    this.selectedIssue.content = response.data;
                    this.table.show = false;
                    this.selectedIssue.show = true;
                })
                .catch((error) => {
                    this.alert.message = 'This issue was not found.';
                    this.alert.icon = 'warning'; 
                    this.table.show = false;
                    this.alert.show = true; 
                }).finally(() => {
                    this.$set(issue, 'is_loading', false);
                });
            },

            backToTable(){
                this.selectedIssue.show = false;
                this.selectedIssue.content = {};
                this.table.show = true;
            },

            clear(){
                this.username = '';
                this.repository.name = '';
                this.repository.link = '';
                this.table.show = false;
                this.table.loader = false;
                this.resetAlert();
            },

            resetAlert(){
                this.alert.show = false;
                this.alert.message = '';
                this.alert.icon = ''; 
            }
        }
    }
</script>
<style>

    #main-div{
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .spinner-border-sm{
        padding-left: 0;
        padding-right: 0;
        margin-right: 1rem;
        margin-top: -0.2rem;
    }
    
</style>