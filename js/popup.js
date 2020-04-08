//清空缓存的用户数据
$("#cached").click(function () {
    clear_cache()
})
//更新缓存的用户数据
$("#update").click(function () {
    update_cache()
})

//设置title为value
$("#block_rate_below").change(function () {
    console.log("change")
    this.title = $(this).val()
})

$("#featured").click(function (e) {

    if ($(this).is(":checked")) {
        if (confirm("Warning:Cache will be cleared,continue?")) {
            clear_cache()
        }
        else {
            e.preventDefault()
        }
    }
})

set_binding("extension_enabled", $("#switch").get(0))
set_binding("auto_block", $("#auto").get(0))
set_binding("need_featured_answer", $("#featured").get(0))
set_binding("cache_new_users", $("#cache_new_users").get(0))
set_binding("block_rate_below", $("#block_rate_below").get(0))
set_binding("show_log", $("#show_log").get(0))
set_binding("validity_duration", $("#validity_duration").get(0))
binding_list("blocked_users", $("#blocked_users").get(0))
binding_list("white_list", $("#white_list").get(0))

function binding_list(key, tbody) {

    ((key, tbody) => {
        let list = []

        chrome.storage.local.get([key], function (rslt) {

            list = typeof rslt[key] === "undefined" ? [] : rslt[key]

            show_list()
            console.log(list)

            function remove_block(username) {
                while (list.indexOf(username) > -1) {
                    list.splice(list.indexOf(username), 1)
                }
                var obj={  }
                obj[key]=list
                chrome.storage.local.set(obj)
            }

            function show_list() {
                $(tbody).empty()
                for (const u of list) {

                    let tr = $("<tr>")
                    tr.append($("<td>" + u + "</td>"))
                    let a = $("<a href='#'' style='text-decoration: none' title='Remove this user from the list'>❌</a>")
                    a.click(function () {
                        $(this).closest("tr").hide()

                        remove_block(u)

                    })
                    let db = $("<td></td>")
                    db.append(a)
                    tr.append(db)
                    $(tbody).append(tr)

                }
            }
        })

    })(key, tbody)
}







function set_binding(key1, check1) {
    let key = key1
    let check = check1
    $(check).change(function () {
        set_status()
    })

    chrome.storage.local.get([key], function (result) {

        switch (check.type) {
            case "checkbox":
                $(check).attr("checked", result[key])
                break
            default:
                $(check).val(result[key])
        }
        $(check).trigger("change");
        set_status()
    })


    function set_status() {
        let value = (function () {
            switch (check.type) {
                case "checkbox":
                    return $(check).is(":checked")
                default:
                    return $(check).val()
            }
        })()
        console.log("value:" + value)

        chrome.tabs.executeScript({
            code: key + '=' + value
        }, () => chrome.runtime.lastError);
        let obj = {}
        obj[key] = value
        chrome.storage.local.set(obj)
    }
}


function clear_cache() {
    chrome.storage.local.set({ "result_buffer": {} }, function () {
        console.log("cache cleared!")
    })
}

function update_cache() {
    chrome.tabs.executeScript({
        code: "update_cache()"
    }, () => chrome.runtime.lastError);
}


