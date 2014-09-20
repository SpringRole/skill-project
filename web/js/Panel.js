var Panel = function(node, initParams) {
	this.initParams = initParams;
	this.$subPanels = {};
	this.$activeSubpanel;

	var that = this;

    var userRole = "user"; //editor, anonymous

	$.ajax({
      url: baseUrl + "panel/getPanel/" + node.id + "/",
    }).done(function(content) {
    	$("#panel").empty().append(content);
    	$("#panel .panel-content").each(function (index, subPanel) {
            subPanelId = $(subPanel).attr("id");
    		that.$subPanels[subPanelId] = $(subPanel);
            that.initSubPanel(subPanel);
            that.loadSubPanelEvents(subPanel, userRole);
    	});

    	$("#panel").show("slide", {
    		direction: "right",
    		complete: function () {
                that.$activeSubpanel = that.$subPanels["first-panel"];
                that.initParams.onComplete();
            }
    	});
	});

	this.close = function(params) {
		$("#panel").hide("slide", {
			direction: "right", 
			complete: function() {
                that.$activeSubpanel.hide();
                params.onComplete();
            }
		});
	}

	this.loadSubPanelEvents = function(subPanel, userRole) {
        var subPanelId = $(subPanel).attr("id");
        switch (subPanelId) {
            case "first-panel":
                $(subPanel).children("a.panel-btn").each(function (loadBtnIndex, loadBtn) {
                    $(loadBtn).on("tap click", function() {
                        var panelToLoad = $(loadBtn).data("panel");
                        $("#" + panelToLoad).show("slide", {
                            direction: "right"
                        });
                        that.$activeSubpanel = $("#" + panelToLoad);
                    });
                })
                break;
            case "create-skill-panel":
                $(subPanel).find(".img-btn").on("tap click", function() {
                    $(subPanel).find("#creationType").val($(this).data("value"));
                    $(subPanel).find("#skillParentUuid").val($(this).data("parentuuid"));
                    $(subPanel).find(".img-btn").toggleClass("selected");
                });

                $("#create-skill-form").on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $("#create-skill-form").attr("action"),
                        type: $("#create-skill-form").attr("method"),
                        data: $("#create-skill-form").serialize(),
                        success: function(response){
                            console.log(response);
                            if (response.status == "ok"){
                                $("#create-skillName").val("");
                                $("#skillParentUuid").val(response.data.uuid);
                                $("#creationTypeParent").data("parentuuid", response.data.uuid);
                                $(subPanel).find(".message-zone").html(response.message).css("display", "inline-block");

                                var creationType = $(subPanel).find("#creationType").val();
                                if (creationType == "child") tree.editedNode.createNewChild(response.data);
                                else if (creationType == "parent") tree.editedNode.createNewParent(response.data);
                            }
                        }
                    });
                });
                break;
            case "move-skill-panel":
                $(subPanel).find(".img-btn").on("tap click", function() {
                    $(subPanel).find("#moveType").val($(this).data("value"));
                    $(subPanel).find("#move-form-submit").val($(this).data("value").toUpperCase());
                    $(subPanel).find(".img-btn").toggleClass("selected");
                });

                $("#move-skill-form").on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $("#move-skill-form").attr("action"),
                        type: $("#move-skill-form").attr("method"),
                        data: $("#move-skill-form").serialize(),
                        success: function(response){
                            if (response.status == "ok"){
                                $(subPanel).find(".message-zone").html(response.message).css("display", "inline-block");
                            }
                        }
                    });
                });
                break;
            case "rename-skill-panel":
                $("#rename-skill-form").on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $("#rename-skill-form").attr("action"),
                        type: $("#rename-skill-form").attr("method"),
                        data: $("#rename-skill-form").serialize(),
                        success: function(response){
                            if (response.status == "ok"){
                                $("#rename-skillName").val("");
                                $("#panel .skillName").html('"'+response.data.name+'"'); //change the skillname at top of panel
                                $(subPanel).find(".message-zone").html(response.message).css("display", "inline-block");
                            }
                        }
                    });
                });
                break;
            case "delete-skill-panel":
                $("#delete-skill-form-submit").hide();
                $(subPanel).find(".sureToDeleteRadio").on("change", function(e){
                    $("#delete-skill-form-submit").toggle();
                });
                $("#delete-skill-form").on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $("#delete-skill-form").attr("action"),
                        type: $("#delete-skill-form").attr("method"),
                        data: $("#delete-skill-form").serialize(),
                        success: function(response){
                            if (response.status == "ok"){
                                tree.editedNode.finishEdit(); //close the panel, nothing to do here anymore    
                            }
                        }
                    });
                });
                break;
            case "translate-skill-panel":                
                $("#translate-skill-form").on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $("#translate-skill-form").attr("action"),
                        type: $("#translate-skill-form").attr("method"),
                        data: $("#translate-skill-form").serialize(),
                        success: function(response){
                            if (response.status == "ok"){
                                $.ajax({
                                    url: baseUrl + "panel/reloadTranslations/" + node.id,
                                    success: function(messagesHtml){
                                        $("#other-translations-list").html(messagesHtml);
                                    }
                                });
                            }
                        }
                    });
                });
                break;
            case "discuss-skill-panel":
                $("#discuss-skill-form").on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $("#discuss-skill-form").attr("action"),
                        type: $("#discuss-skill-form").attr("method"),
                        data: $("#discuss-skill-form").serialize(),
                        success: function(response){
                            if (response.status == "ok"){
                                $("#discuss-message").val("");
                                $.ajax({
                                    url: baseUrl + "panel/reloadDiscussionMessages/" + node.id + "/",
                                    success: function(messagesHtml){
                                        $(".discuss-prev-messages").html(messagesHtml);
                                    }
                                });
                            }
                        }
                    });
                });
                break;
        }

        //Common events
        $(subPanel).find(".back-to-panel-btn").on("tap click", function() {
            $(subPanel).hide("slide", {
                direction:"right"
            });
            that.$activeSubpanel = that.$subPanels["first-panel"];
        });

        $(subPanel).find(".close-panel-btn").on("tap click", function() {
            tree.editedNode.finishEdit();
        });	
	}

    this.initSubPanel = function(subPanel) {
        var subPanelId = $(subPanel).attr("id");
        $(subPanel)
            .css({
                position: "absolute",
                width: $("#panel").width() 
            });
        if (subPanelId != "first-panel") $(subPanel).hide();
    }
}



