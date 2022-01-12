<template>
    <div id="main-div">

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
        </div>

        <hr>
                
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

    .spinner-border-sm{
        padding-left: 0;
        padding-right: 0;
        margin-right: 1rem;
        margin-top: -0.2rem;
    }
    
</style>