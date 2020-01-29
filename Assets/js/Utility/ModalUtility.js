Centauri.Utility.ModalUtility = function(title, description, options, callbacks) {
    Centauri.Utility.ModalUtility.close = function(id) {
        if(id != "") {
            $("#modal-" + id).modal("dispose");
            $("#modal-" + id).remove();
        } else {
            $(".modal").modal("hide");
            $(".modal").modal("dispose");
            $(".modal").remove();
        }
    };

    var html = "";
    var addHTMLFn = Centauri.Utility.ModalUtility.addHTML;

    var id = "modal";
    var modalSize = "";
    var closeclass = "danger";
    var saveclass = "success";

    var closeOnSave = true;

    if(Centauri.isNotUndefined(options)) {
        if(Centauri.isNotUndefined(options.id)) {
            id = "-" + options.id;
        }

        if(Centauri.isNotUndefined(options.size)) {
            modalSize = " modal-" + options.size;
        }
        if(Centauri.isNotUndefined(options.closeOnSave)) {
            closeOnSave = options.closeOnSave;
        }

        if(Centauri.isNotUndefined(options.close)) {
            if(Centauri.isNotUndefined(options.close.class)) {
                closeclass = options.close.class;
            }
        }

        if(Centauri.isNotUndefined(options.save)) {
            if(Centauri.isNotUndefined(options.save.class)) {
                saveclass = options.save.class;
            }
        }
    }

    html = "<div class='modal fade' id='modal" + id + "' tabindex='-1' role='dialog' aria-labelledby='modal" + id + "-label' aria-hidden='true'>|</div>";
    html = addHTMLFn(html, "<div class='modal-dialog" + modalSize + "' role='document'>|</div>");
    html = addHTMLFn(html, "<div class='modal-content'>|</div>");
    html = addHTMLFn(html, "<div class='modal-header'>|</div>&&");
    html = addHTMLFn(html, "<h5 class='modal-title' id='modallabel'>" + title + "</h5>|");
    html = addHTMLFn(html, "<button type='button' class='close' data-type='close' aria-label='Close'>|</button>");
    html = addHTMLFn(html, "<span aria-hidden='true'>&times;</span>");
    html = addHTMLFn(html, "<div class='modal-body'>" + description + "</div>&&", "&&");
    html = addHTMLFn(html, "<div class='modal-footer'>|</div>", "&&");
    html = addHTMLFn(html, "<button type='button' data-type='save' class='btn btn-" + saveclass + " waves-effect waves-light mr-3'>" + options.save.label + "</button>&&");
    html = addHTMLFn(html, "<button type='button' data-type='close' class='btn btn-" + closeclass + " waves-effect waves-light'>" + options.close.label + "</button>", "&&");

    $("body").append(html);
    $("#modal" + id).modal();

    Centauri.Utility.ModalUtility.Validator($("#modal"));

    $("#modal" + id + " select.mdb-select.md-form").materialSelect();

    var selectedValue = $("#modal" + id + " select.mdb-select.md-form").val();
    var selectedValueText = $.trim($("#modal" + id + " select option[value='" + selectedValue + "']").text());

    $("#modal" + id + " select.mdb-select.md-form").parent().find("ul > li").each(function() {
        var thisText = $.trim($("span", this).text());
        if(thisText == selectedValueText) {
            $(this).addClass("active selected");
            return;
        }
    });

    /**
     * Giving form fields (e.g. input, selects etc.) unique id & for attributes
     */
    Centauri.fn.__FormInputFix();

    $("#modal" + id + "").on("hidden.bs.modal", function(e) {
        // $("#modal").modal("dispose");
        // $(this).remove();
    });

    $("#modal" + id + " button").on("click", this, function() {
        var btntype = $(this).data("type");

        if(btntype == "close") {
            Centauri.fn.Modal.close();

            if(Centauri.isNotUndefined(callbacks.close)) {
                callbacks.close();
            }
        }

        if(btntype == "save") {
            if(closeOnSave) {
                Centauri.fn.Modal.close();
            }

            callbacks.save();
        }
    });
};

Centauri.Utility.ModalUtility.addHTML = function(crtHTML, html, split = "|") {
    return (crtHTML.split(split).join(html));
};


/**
 * Example Usage:
 * > Centauri.fn.Modal("Hello...", "...world!", {id: "id", close: {label: "CLOOOSE"}, save: {label: "SAAAAVE"}}, {size: "lg"});
 * with Callback > Centauri.fn.Modal("Hello...", "...world!", {id: "id", close: {label: "Cancel",class: "warning"}, save: {label: "Delete",class: "danger"}}, {save() {}});
 */
Centauri.fn.Modal = function(title, description, options, callbacks) {
    return Centauri.Utility.ModalUtility(title, description, options, callbacks);
};

Centauri.fn.Modal.close = function(id) {
    var nID = "";

    if(Centauri.isNotUndefined(id)) {
        nID = id;
    }

    Centauri.Utility.ModalUtility.close(nID);
};
