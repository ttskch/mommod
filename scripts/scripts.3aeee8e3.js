Parse.initialize("dsgTYZ4eqkKoWM20KtznAiZ1UKNVtjv1dmeUPoEo","OkRijPHNgMwfsJdBTTbsHwaZLvO7y2PyqzqkZfrK"),angular.module("mommodApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","hc.marked","hljs","emoji","ui.bootstrap","ngToast"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/new",{templateUrl:"views/new.html",controller:"NewCtrl"}).when("/list",{templateUrl:"views/list.html",controller:"ListCtrl"}).when("/topic/:topicId",{templateUrl:"views/topic.html",controller:"TopicCtrl"}).when("/topic/:topicId/joiners",{templateUrl:"views/joiners.html",controller:"JoinersCtrl"}).when("/account",{templateUrl:"views/account.html",controller:"AccountCtrl"}).otherwise({redirectTo:"/"})}]).config(["markedProvider",function(a){a.setOptions({gfm:!0,tables:!0,breaks:!0,pedantic:!1,sanitize:!1,smartLists:!0,smartypants:!1})}]).config(["hljsServiceProvider",function(a){a.setOptions({tabReplace:"    "})}]).config(["ngToastProvider",function(a){a.configure({className:"danger",additionalClasses:"clickable",timeout:5e3,animation:"slide"})}]).controller("SignOutCtrl",["$scope","$rootScope","$location","$timeout","cachedParseQuery",function(a,b,c,d,e){a.signOut=function(){confirm("Sign out?")&&(Parse.User.logOut(),e.destroy(),c.path("/"),d())}}]).run(["$rootScope","$timeout",function(a,b){Parse.User.extend({getDisplayName:function(){return this.get("displayName")||this.get("username")},getAvatarUrl:function(){return this.get("avatarUrl")||"images/default-avatar.png"}}),a.$on("$locationChangeSuccess",function(){a.currentUser=Parse.User.current(),b()})}]),angular.module("mommodApp").controller("MainCtrl",["$scope","$rootScope","$location","$timeout","ngToast",function(a,b,c,d,e){Parse.User.current()&&c.path("list"),a.tab=0,a.user={username:"",email:"",password:""},a.signIn=function(){b.spinner=!0,Parse.User.logIn(a.user.username,a.user.password).done(function(){c.path("list"),b.spinner=!1,d()}).fail(function(a){e.create("["+a.code+"] "+a.message),b.spinner=!1,d()})},a.signUp=function(){b.spinner=!0;var f=new Parse.User;f.set("username",a.user.username).set("email",a.user.email).set("password",a.user.password).signUp().done(function(){c.path("list"),e.create({className:"success",content:"Successfully signed up :)",timeout:3e3}),b.spinner=!1,d()}).fail(function(a){e.create("["+a.code+"] "+a.message),b.spinner=!1,d()})}}]),angular.module("mommodApp").controller("ListCtrl",["$scope","$rootScope","$timeout","assertSignedIn","ngToast","parse",function(a,b,c,d,e,f){d(),a.topics=[],a.joinerCounts=[],a.commentCounts=[],a.lastCommentedAts=[],b.spinner=!0,f.getTopics().then(function(b){a.topics=b;var c=Parse.Promise.as();return b.forEach(function(b){c=c.then(function(){return f.getLastCommentedAt(b)}).done(function(c){a.lastCommentedAts[b.id]=c})}),Parse.Promise.when(Parse.Promise.as(b),c)}).then(function(b){b.forEach(function(b){var c=_.keys(b.getACL().toJSON()).length;a.joinerCounts[b.id]=c});var c=Parse.Promise.as();return b.forEach(function(b){c=c.then(function(){return f.countComments(b)}).done(function(c){a.commentCounts[b.id]=c}).fail(function(){a.counts.comments.push("-")})}),c}).done(function(){b.spinner=!1,c()}).fail(function(a){e.create("["+a.code+"] "+a.message),b.spinner=!1,c()})}]),angular.module("mommodApp").controller("NewCtrl",["$scope","$rootScope","$location","$timeout","assertSignedIn","ngToast","parse",function(a,b,c,d,e,f,g){e(),a.title="",a.content="",a.createTopic=function(){b.spinner=!0,g.postTopic({title:a.title,content:a.content}).done(function(a){c.path("topic/"+a.id),b.spinner=!1,d()}).fail(function(a){f.create("["+a.code+"] "+a.message),b.spinner=!1,d()})}}]),angular.module("mommodApp").controller("TopicCtrl",["$scope","$rootScope","$location","$anchorScroll","$routeParams","$timeout","assertSignedIn","ngToast","parse",function(a,b,c,d,e,f,g,h,i){g(),a.topic=null,a.comments=[],a.joinsers=[],a.replyTo=null,a.commentContent="",a.lastCommentedAt=null;var j=function(a){return a.isEditing=!1,a.editingContent=a.get("content"),void 0!=a.get("title")&&(a.editingTitle=a.get("title")),a};b.spinner=!0,i.getTopic(e.topicId).then(function(b,c){return a.topic=j(b),a.joiners=c,Parse.Promise.when(Parse.Promise.as(b),i.getLastCommentedAt(a.topic))}).then(function(b,c){return a.lastCommentedAt=c,i.getComments(b)}).done(function(c){a.comments=_.map(c,function(a){return j(a)}),b.spinner=!1,f(),f(d)}).fail(function(a){c.path("list"),h.create("["+a.code+"] "+a.message),b.spinner=!1,f()}),a.postComment=function(){b.spinner=!0,i.postComment({content:a.commentContent,topic:a.topic,replyTo:a.replyTo}).done(function(c,d){a.commentContent="",a.replyTo=null,a.comments=_.map(d,function(a){return j(a)}),a.lastCommentedAt=new Date,b.spinner=!1,f()}).fail(function(a){h.create("["+a.code+"] "+a.message),b.spinner=!1,f()})},a.deleteComment=function(c){confirm("Delete this comment?")&&(b.spinner=!0,i.deleteComment(c).done(function(c,d){a.comments=_.map(d,function(a){return j(a)}),b.spinner=!1,f()}).fail(function(a){h.create("["+a.code+"] "+a.message),b.spinner=!1,f()}))},a.updateTopic=function(c){b.spinner=!0,i.updateTopic(c,{title:c.editingTitle,content:c.editingContent}).done(function(c){a.topic=j(c),b.spinner=!1,f()}).fail(function(a){h.create("["+a.code+"] "+a.message),b.spinner=!1,f()})},a.updateComment=function(c){b.spinner=!0,i.updateComment(c,{content:c.editingContent}).done(function(c){var d=_.findIndex(a.comments,{id:c.id});a.comments[d]=j(c),b.spinner=!1,f()}).fail(function(a){h.create("["+a.code+"] "+a.message),b.spinner=!1,f()})},a.updateTopicClosed=function(c,d){confirm((d?"Close":"Reopen")+" this topic?")&&(b.spinner=!0,i.updateTopic(c,{closed:d}).done(function(c){a.topic=j(c),b.spinner=!1,f()}).fail(function(a){h.create("["+a.code+"] "+a.message),b.spinner=!1,f()}))}}]),angular.module("mommodApp").controller("JoinersCtrl",["$scope","$rootScope","$location","$routeParams","$timeout","assertSignedIn","ngToast","parse",function(a,b,c,d,e,f,g,h){f(),a.topic=null,a.joiners=[],a.usernameToAdd="",b.spinner=!0,h.getTopic(d.topicId).then(function(b){var c=new Parse.Promise;return b?(a.topic=b,Parse.User.current()&&!b.getACL().getWriteAccess(Parse.User.current().id)?(c.reject({code:"000",message:"You have no write access."}),c):h.getJoiners(b)):(c.reject({code:"000",message:"You have no read access."}),c)}).done(function(c){a.joiners=c,b.spinner=!1,e()}).fail(function(d){a.topic?c.path("topic/"+a.topic.id):c.path("list"),g.create("["+d.code+"] "+d.message),b.spinner=!1,e()}),a.addJoiner=function(){b.spinner=!0,h.addJoiner(a.topic,a.usernameToAdd).done(function(c,d){a.joiners=d,a.usernameToAdd="",b.spinner=!1,e()}).fail(function(a){g.create("["+a.code+"] "+a.message),b.spinner=!1,e()})},a.removeJoiner=function(c){confirm('Remove "'+c.get("username")+'"?')&&h.removeJoiner(a.topic,c).done(function(c){var d=_.findIndex(a.joiners,{id:c.id});delete a.joiners[d],a.joiners=_.compact(a.joiners),b.spinner=!1,e()}).fail(function(a){g.create("["+a.code+"] "+a.message),b.spinner=!1,e()})}}]),angular.module("mommodApp").controller("AccountCtrl",["$scope","$rootScope","$location","$timeout","assertSignedIn","ngToast","parse",function(a,b,c,d,e,f,g){e(),a.user=Parse.User.current(),a.file=null,a.form={username:Parse.User.current().get("username"),email:Parse.User.current().get("email"),displayName:Parse.User.current().get("displayName"),password:""},a.updateAccount=function(){b.spinner=!0,""==a.form.password&&delete a.form.password,g.updateUser(a.form,a.file).done(function(c){a.form.password="",a.file=null,f.create({className:"success",content:"Account is successfully updated.",timeout:3e3}),b.currentUser=c,b.spinner=!1,d()}).fail(function(a){f.create("["+a.code+"] "+a.message),b.spinner=!1,d()})}}]),angular.module("mommodApp").factory("assertSignedIn",["$location",function(a){return function(){Parse.User.current()||a.path("/")}}]).factory("cachedParseQuery",["$cacheFactory",function(a){return{use:function(b,c,d){d=d||!1;var e=a.get("parseQuery")||a("parseQuery"),f=JSON.stringify(b)+"#"+c;return void 0===e.get(f)||d?b[c]().done(function(a){return void 0==a&&(a=null),e.put(f,a),Parse.Promise.as(a)}):Parse.Promise.as(e.get(f))},destroy:function(){a.get("parseQuery")&&a.get("parseQuery").removeAll()}}}]).factory("parse",["cachedParseQuery",function(a){return{getTopics:function(b){b=b||!1;var c=new Parse.Query("Topic");return a.use(c.include("user").descending("updatedAt"),"find",b)},getTopic:function(b,c){c=c||!1;var d=new Parse.Query("Topic");return a.use(d.equalTo("objectId",b).include("user"),"first",c).done(function(b){if(!b){var c=new Parse.Promise;return c.reject({code:-1,message:"You have no read access."}),c}var e=_.keys(b.getACL().toJSON());d=new Parse.Query("_User");var f=a.use(d.containedIn("objectId",e).ascending("username"),"find");return Parse.Promise.when(Parse.Promise.as(b),f)})},postTopic:function(a){var b=new Parse.ACL;b.setPublicReadAccess(!1),b.setPublicWriteAccess(!1),b.setReadAccess(Parse.User.current().id,!0),b.setWriteAccess(Parse.User.current().id,!0);var c=this,d=new Parse.Object("Topic");return d.set("title",a.title).set("content",a.content).set("user",Parse.User.current()).setACL(b).save().done(function(a){return c.getTopics(!0),Parse.Promise.as(a)})},updateTopic:function(a,b){return _.pairs(b).forEach(function(b){a.set(b[0],b[1])}),a.save()},getLastCommentedAt:function(b,c){c=c||!1;var d=new Parse.Query("Comment");return a.use(d.equalTo("topic",b).descending("createdAt"),"first",c).done(function(a){return a?Parse.Promise.as(a.createdAt):Parse.Promise.as(null)})},getComments:function(b,c){c=c||!1;var d=new Parse.Query("Comment");return a.use(d.equalTo("topic",b).include("user").ascending("createdAt"),"find",c)},countComments:function(b,c){c=c||!1;var d=new Parse.Query("Comment");return a.use(d.equalTo("topic",b),"count",c)},postComment:function(a){var b=new Parse.ACL;b.setPublicReadAccess(!1),b.setPublicWriteAccess(!1),b.setReadAccess(Parse.User.current().id,!0),b.setWriteAccess(Parse.User.current().id,!0);var c=this,d=new Parse.Object("Comment");return d.set("content",a.content).set("user",Parse.User.current()).set("topic",a.topic).set("replyTo",a.replyTo).setACL(b).save().done(function(a){return Parse.Promise.when(Parse.Promise.as(a),c.getComments(a.get("topic"),!0))})},updateComment:function(a,b){return _.pairs(b).forEach(function(b){a.set(b[0],b[1])}),a.save()},deleteComment:function(a){var b=this;return a.destroy().done(function(a){return Parse.Promise.when(a,b.getComments(a.get("topic"),!0))})},getStargazers:function(b,c){c=c||!1;var d=new Parse.Query("Star");return a.use(d.equalTo("comment",b).ascending("user"),"find",c).done(function(a){var b=_.map(a,function(a){return a.get("user")});return Parse.Promise.as(b)})},getStargazersCollection:function(a,b){b=b||!1;var c=[],d=this,e=Parse.Promise.as();return a.forEach(function(a){e=e.then(function(){return d.getStargazers(a,b)}).done(function(b){return c[a.id]=b,Parse.Promise.as()})}),e.done(function(){return Parse.Promise.as(c)})},star:function(a){var b=new Parse.ACL;b.setPublicReadAccess(!1),b.setPublicWriteAccess(!1),b.setReadAccess(Parse.User.current().id,!0),b.setWriteAccess(Parse.User.current().id,!0);var c=new Parse.Object("Star");return c.set("user",Parse.User.current()).set("comment",a).setACL(b).save().done(function(){return Parse.Promise.as()})},unstar:function(a){var b=new Parse.Query("Star");return b.equalTo("comment",a).equalTo("user",Parse.User.current()).first().done(function(a){return a.destroy()})},getJoiners:function(b,c){c=c||!1;var d=_.keys(b.getACL().toJSON()),e=new Parse.Query("_User");return a.use(e.containedIn("objectId",d).ascending("username"),"find",c)},addJoiner:function(b,c){var d=this,e=new Parse.Query("_User");return a.use(e.equalTo("username",c),"first").then(function(a){if(!a){var c=new Parse.Promise;return c.reject({code:"000",message:"No such user."}),c}return b.getACL().setReadAccess(a.id,!0),Parse.Promise.when(b.save(),Parse.Promise.as(a))}).done(function(a,b){return Parse.Promise.when(Parse.Promise.as(b),d.getJoiners(a,!0))})},removeJoiner:function(a,b){return a.getACL().setReadAccess(b.id,!1),a.save().done(function(){return Parse.Promise.as(b)})},updateUser:function(a,b){var c=Parse.User.current();_.pairs(a).forEach(function(a){c.set(a[0],a[1])});var d=Parse.Promise.as();if(b){var e=new Parse.File(b.name,b);d=d.then(function(){return e.save()}).done(function(){return c.set("avatarUrl",e.url()),Parse.Promise.as()})}return d.done(function(){return c.save()})}}}]),angular.module("mommodApp").directive("markdownEditor",function(){return{restrict:"E",replace:!0,templateUrl:"views/directives/markdown-editor.html",scope:{content:"="},link:function(a,b,c){a.required="required"in c,a.isEditing=!0}}}).directive("anyHref",["$location",function(a){return{restrict:"A",scope:{href:"@anyHref"},link:function(b,c,d){c.on("click",function(){var c=b.href.replace(/^#/,"").split("#"),d=c[0]+(c[1]?"#"+c[1]:"");b.$apply(function(){a.url(d)})})}}}]).directive("hashFocusedClass",["$location",function(a){return{restrict:"A",scope:{hashFocusedClass:"@",hash:"@"},link:function(b,c,d){a.hash()==b.hash&&c.addClass(b.hashFocusedClass)}}}]).directive("autofocus",function(){return{restrict:"A",scope:!1,link:function(a,b,c){b.focus()}}}).directive("spinnerModal",function(){return{restrict:"E",replace:!0,templateUrl:"views/directives/spinner-modal.html",scope:{trigger:"="},link:function(a,b,c){b.modal({backdrop:"static",keyboard:!1,show:!1}),a.$watch("trigger",function(){b.modal(a.trigger?"show":"hide")})}}}).directive("parseHide",function(){return{restrict:"A",scope:{parseHide:"="},link:function(a,b,c){a.$watch("parseHide",function(){a.parseHide&&(a.parseHide.getACL().getWriteAccess(Parse.User.current())||b.hide())})}}}).directive("starButton",["$cacheFactory","$timeout","parse",function(a,b,c){return{restrict:"E",replace:!0,templateUrl:"views/directives/star-button.html",scope:{comment:"="},link:function(d,e,f){var g=a.get("stargazers")||a("stargazers");d.spinner=!0,c.getStargazers(d.comment,!0).done(function(a){g.put(d.comment.id,a),d.spinner=!1,b()}),d.isStarred=function(a){if(!Parse.User.current())return!1;var b=g.get(a.id);return!!_.findWhere(b,{id:Parse.User.current().id})},d.countStargazers=function(a){return _.toArray(g.get(a.id)).length},d.toggleStar=function(a){d.spinner=!0,d.isStarred(a)?c.unstar(a).done(function(){var c=g.get(a.id),e=_.findIndex(c,{id:Parse.User.current().id});delete c[e],c=_.compact(c),g.put(a.id,c),d.spinner=!1,b()}):c.star(a).done(function(){var c=g.get(a.id);c.push(Parse.User.current()),g.put(a.id,c),d.spinner=!1,b()})}}}}]).directive("fileModel",["$timeout",function(a){return{restrict:"A",scope:{fileModel:"="},link:function(b,c,d){c.on("change",function(){b.fileModel=c[0].files[0],a()}),b.$watch("fileModel",function(){b.fileModel||(c.val(null),a())})}}}]);