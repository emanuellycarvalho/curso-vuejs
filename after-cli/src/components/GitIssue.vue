<template>
    <div id="main-div" class="container">

        <div id="title" class="row justify-content-center">
            <div class="col-md-9">
                <h3>Issue number {{ $route.params.issue }} on {{ $route.params.user }}'s repository {{ $route.params.repo }}</h3>
            </div>
        </div>
                
        <div id="alert" v-if="alert.show" class="row justify-content-center">
            <div class="col-md-9">
                <div class="alert alert-dark" role="alert">
                    <svg v-if="alert.icon == 'info'" class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
                    <svg v-if="alert.icon == 'warning'" class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                    <svg v-if="alert.icon == 'success'" class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
                    {{ alert.message }}
                </div>
            </div>
        </div>

        <div id="loader" v-if="issue.loader" class="d-flex justify-content-center">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div id="issue" v-if="issue.show" class="row justify-content-center">
            <div class="col-9">
                <div class="card">
                    <div class="card-header">
                        <h5>{{ issue.content.title }}</h5>
                    </div>
                    <div class="card-body">
                        {{ issue.content.body }}
                    </div>
                    <div class="card-footer">
                        <div class="row justify-content-end">
                            <div class="col-3">
                                <a href="javascript.history.go(-1)" class="btn btn-primary">Back to search</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'GitIssue',
        data(){
            return {
                issue: {
                    loader: false,
                    show: false,
                    loader: false,
                    content: {}
                },
                alert:{
                    message: '',
                    icon: '',
                    show: false,
                },
            }
        },

        created(){
            this.getIssue();
        },

        methods:{
            getIssue(){
                this.resetAlert();
                this.issue.show = false;
                this.issue.loader = true;
                
                const url = `https://api.github.com/repos/${this.$route.params.user}/${this.$route.params.repo}/issues/${this.$route.params.issue}`;
                axios.get(url).then((response) => {
                    this.issue.content = response.data;
                    this.issue.show = true;
                })
                .catch((error) => {
                    this.alert.message = 'This issue was not found.';
                    this.alert.icon = 'warning'; 
                    this.alert.show = true; 
                }).finally(() => {
                    this.issue.loader = false;
                });                
            },

            backToTable(){
                this.issue.show = false;
                this.issue.content = {};
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

    #title{
        text-align: center;
        margin: 15px;
    }

    .card-header{
        text-align: center;
    }
    
</style>