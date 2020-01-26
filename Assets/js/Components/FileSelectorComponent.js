Centauri.Components.FileSelectorComponent = (type, cb = null) => {
    if(type == "show") {
        let $modal = $("#modal");
        $modal.hide();

        let $fileselector = $("#file-selector");

        $(".item", $fileselector).each(function() {
            let $item = $(this);

            $item.click(e => {
                $(this).toggleClass("selected");
            });
        });

        $(".buttons button", $fileselector).each(function() {
            let $btn = $(this);

            $btn.click(e => {
                if($(this).hasClass("save")) {
                    let selectedFiles = $(".item.selected", $fileselector);

                    Centauri.Notify("success", "File-Selector", selectedFiles.length + " file(s) has been selected.");

                    if(Centauri.isNotNull(cb)) {
                        let selectedUids = "";

                        $(selectedFiles).each(function(index) {
                            let uid = $(this).data("uid");
                            selectedUids += uid + ((index + 1) != selectedFiles.length ? "," : "");
                        });

                        cb({
                            selectedFiles: selectedFiles,
                            selectedUids: selectedUids
                        });
                    } else {
                        console.error("Centauri.Component.FileSelectorComponent: Callback (" + cb + " [" + typeof cb + "]) can't be null!");
                    }
                }

                if($(this).hasClass("cancel")) {
                    // Centauri.Notify("primary", "File-Selector", "No image has been selected.");
                }

                $modal.show();
                Centauri.Components.FileSelectorComponent("close");
            });
        });

        $("#file-selector-search", $fileselector).keyup(function(e) {
            let value = $(this).val();

            $(".items .item", $fileselector).hide();

            if(value == "") {
                $(".items .item", $fileselector).show();
                return;
            }

            $(".items .item", $fileselector).each(function() {
                let title = $.trim($(".title", $(this)).text());

                if(Centauri.strContains(title, value)) {
                    $(this).show();
                }
            });
        });
    }

    if(type == "close") {
        $("#file-selector").addClass("inactive");

        setTimeout(() => {
            $("#file-selector").remove();
        }, 660);
    }

    else {
        console.warn("Centauri.Components.FileSelectorComponent: Type: " + type + " does not exists!");
    }
};

Centauri.Components.FileSelectorComponent.AnimatedSelectedFiles = true;
