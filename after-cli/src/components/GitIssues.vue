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
                            <input v-model="repository" type="text" class="form-control">
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
        <div id="table" v-if="this.table.show" class="row justify-content-center">
            <div class="col-md-10">
                <table class="table table-striped table-dark table-bordered table-hover">
                    <caption>Issues found on </caption>
                    <thead>
                        <tr>
                            <th class="col-sm-2">Number</th>
                            <th class="col">Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>
            </div>
        </div>
        <div id="alert" v-if="this.alert.show" class="row justify-content-center">
            <div class="col-md-10">
                <div class="alert alert-dark" role="alert">
                    <svg v-if="this.alert.icon == 'info'" class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
                    <svg v-if="this.alert.icon == 'warning'" class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                    <svg v-if="this.alert.icon == 'success'" class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
                    {{ this.alert.message }}
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
                repository: '',
                issues: [],
                alert:{
                    message: '',
                    icon: '',
                    show: false,
                },
                table: {
                    show: false
                }
            }
        },
        methods:{
            search(){
                this.resetAlert();
                
                if(!this.username || !this.repository){
                    this.alert.message = 'Please, fill the inputs correctly.';
                    this.alert.icon = 'warning'; 
                    this.alert.show = true;
                }

                const url = `https://api.github.com/repos/${this.username}/${this.repository}/issues`;
                axios.get(url).then((response) => {
                    if(response.data.length > 0){
                        this.issues = response.data;
                        this.table.show = true;
                        return;
                    }

                    this.alert.message = 'No issues were found here!';
                    this.alert.icon = 'success'; 
                    this.alert.show = true;

                });
            },

            clear(){
                this.username = '';
                this.repository = '';
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
    }
    
</style>