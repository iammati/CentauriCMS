Centauri.fn.Ajax = (ajax, method, data, callbacks, options) => {
    if(Centauri.isUndefined(callbacks.success)) {
        return console.warn("Centauri.fn.Ajax: Can't call an AJAX without a callback-handler for the success-scope!");
    }

    let url = Centauri.Helper.AjaxHelper.buildAjaxURL(Centauri.Utility.PathsUtility, ajax, method);

    if(Centauri.fn.Ajax.Overlayer) {
        $("#maincontent .overlayer").removeClass("hidden");
        $("#maincontent .overlayer .loader").removeClass("hidden");
    }

    Centauri.Helper.VariablesHelper.xhr = $.ajax({
        url: url,
        type: "POST",

        data: data,

        success: (data) => {
            if(Centauri.isNotUndefined(options)) {
                if(
                    Centauri.isNotUndefined(options.closeEditorComponentOnSuccess) &&
                    (options.closeEditorComponentOnSuccess)
                ) {
                    Centauri.Components.EditorComponent("hide");

                    if(Centauri.Components.EditorComponent.ClearOnSave) {
                        setTimeout(() => {
                            Centauri.Components.EditorComponent("clear", {
                                forceClear: true
                            });
                        }, Centauri.Components.EditorComponent.TransitionTime);
                    }
                }
            }

            if(Centauri.fn.Ajax.Overlayer) {
                $("#maincontent .overlayer").addClass("hidden");
                $("#maincontent .overlayer .loader").addClass("hidden");
            }

            callbacks.success(data);
        },

        error: (data) => {
            $("#maincontent .overlayer").addClass("hidden");

            if(Centauri.fn.Ajax.Overlayer) {
                $("#maincontent .overlayer .loader").addClass("hidden");
            }

            if(!navigator.onLine) {
                Centauri.Notify("error", "Internet-Connection lost", "Make sure your connection is stable to execute this action.");
            }

            if(Centauri.isNotUndefined(callbacks.error)) {
                callbacks.error(data);
            } else {
                // console.error(data);
            }
        },

        complete: (data) => {
            if(Centauri.isNotUndefined(callbacks.complete)) {
                callbacks.complete(data);
            }
        }
    });
};

Centauri.Utility.Ajax = () => {
    Centauri.fn.Ajax.Overlayer = true;

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content")
        }
    });
};

window.onload = () => {
    Centauri.Utility.Ajax();

    $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
        // Session is over => throws unknown status
        if(thrownError == "unknown status") {
            location.href = "action/Backend/logout";
        }

        // General AJAX errors - some of Internal Server Errors are custom and some by Laravel default (a json-error-object returns sometimes - reason: unknown yet.)
        if(
            thrownError == "Internal Server Error" ||
            thrownError == "Gateway Timeout"
        ) {
            Centauri.Notify("error", thrownError, jqxhr.responseText);
            console.error(jqxhr);
        }
    });

    $(document).ajaxSuccess(function(event, xhr, settings) {
        if(Centauri.Helper.VariablesHelper.__closeAjax) {
            Centauri.Components.EditorComponent("close");
            Centauri.Helper.VariablesHelper.__closeAjax = false;
        }
    });
};
