/**
 * Created by MR_CH on 2017/4/21.
 */
;(function () {
    'use strict'
    var $add_task_submit = $(".add-task button");
    var task_list;
    var $action_del;
    var $action_det;
    var $task_item;
    var $task_detail_mask = $(".task-detail-mask");
    init();

   //
    $add_task_submit.on("click",function (e) {
        e.preventDefault();
        var new_task = {};//注意：每次都新的new_task，否则每次都更改一个变量会出错
        new_task.content = $("input[name=content]").val();
        if(!new_task.content) return;
        if(add_task(new_task)){
            read_tasks();
            $("input[name=content]").val("");
        }
    });

    $task_detail_mask.bind("click",function (e) {
        $(".task-detail").hide();
        $(".task-detail-mask").hide();
    });

    function listen_task_del() {
        $action_del.bind("click",function (e) {
            // var index = parseInt($(e.target).data('index'));

            if (confirm("确定删除？")) {
            var index = parseInt($(e.target).attr("data-index"));
            delete_task(index);
        }

        });
    }

    /*
    添加detail自定义监听
     */
    function listen_task_det(){
        $action_det.bind("click",function (e) {
            var index = parseInt($(e.target).attr("data-index"));
            console.log("detail",index);
            show_data(index);
        });
    }

    function listen_task_item() {
        $task_item.bind("dblclick",function (e) {
            var index = parseInt($(e.target).attr("data-index"));
            show_data(index);
        });

    }

    /*点击detail后显示初始数据*/
    function  show_data(index){
        var task = task_list[index];
        $(".task-detail").css("display","block");
        $(".task-detail-mask").css("display","block");
        $(".task-detail").append('<button type="submit">submit</button>');
        listen_detail_submit(index);/*为submit添加监听*/
        $(".task-detail .content").html(task.content);
        if(task.dec!=undefined) {
            $(".task-detail textarea").val(task.dec)
        }else{
            $(".task-detail textarea").val("");
        };
    }
    /*submit后修改数据*/
    function change_data(index) {
        var $task = task_list[index];
        $task.dec = $(".task-detail textarea").val();
         store.set("task_list",task_list);//保存对task_list的修改
    }

    function listen_detail_submit(index) {
        $(".task-detail button").bind("click",function (e) {
            change_data(index);
            $(".task-detail").css("display","none");
            $(".task-detail-mask").css("display","none");
           $(".task-detail button").remove();//删除button

        });
    }

    function delete_task(index) {

        if(index ===undefined||!task_list[index]) return;
        task_list.splice(index,1);
        store.set("task_list",task_list);
        init();
    }

    function add_task(task) {
        task_list.push(task);
        console.log("length",task_list.length);
        store.set("task_list",task_list);
        return true;
    }

    function read_tasks() {
        $(".task-list").empty();
        $.each(task_list,function (i,task) {
            console.log(i,task.content);
            var $task_content = read_task(task,i);
           $(".task-list").append($task_content);
        });
        $action_del = $(".action.delete");
        $action_det = $(".action.detail");
        $task_item = $(".task-item");

        listen_task_det();
        listen_task_del();//必须有，为每个.action添加事件
        listen_task_item();
    }

    function read_task(data,i) {
        var task =
            '<div class="task-item" data-index=" '+i+'">'+
                '<span><input type="checkbox"></span>'+
                '<span class="task-content">'+data.content+'</span>'+
                '<span class="fr">'+
                    '<span class="action delete" data-index="'+i+'">delete</span>'+
                   ' <span class="action detail" data-index="'+i+'">detail</span>'+
                '</span>'+
            ' </div>';


        return $(task)
    }

    function init() {
        task_list = store.get("task_list")||[];
        read_tasks();

    }
})();