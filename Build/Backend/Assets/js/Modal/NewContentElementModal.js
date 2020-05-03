Centauri.Modal.NewContentElementModal = function() {
    // $("button", $editor).off("click");

    $("button", $editor).on("click", this, function() {
        let $btn = $(this);
        let action = $(this).data("action");

        if(action == "newContentElement") {
            $btn.css("cursor", "wait");

            var rowPos = $(this).parent().parent().attr("data-rowpos");
            var colPos = $(this).parent().attr("data-colpos");
            var sorting = $(this).attr("data-sorting");

            var sorting, $element;
            var insert = $(this).attr("data-insert");
            var type = (Centauri.isNotUndefined($(this).attr("data-type")) ? $(this).attr("data-type") : "");
            var gridsorting = null;

            if(type == "ingrid") {
                gridsorting = $(this).attr("data-gridsorting");
            }

            if(insert == "before") {
                $element = $(this).next();
            }
            if(insert == "after") {
                $element = $(this).next();
            }

            sorting = $element.attr("data-sorting");

            if(Centauri.elExists("#modal-new_contentelement")) {
                $("#modal-new_contentelement").modal("show");
                $btn.css("cursor", "pointer");
                return;
            }

            Centauri.fn.Ajax(
                "ContentElements",
                "getConfigCCE",

                {},

                {
                    success: function(data) {
                        $(".overlayer").removeClass("hidden");

                        Centauri.fn.Modal(
                            "New Content Element",

                            data,

                            {
                                id: "new_contentelement",
                                size: "xl",
                                closeOnSave: false,

                                close: {
                                    label: "",
                                    class: "danger fas fa-times btn-floating"
                                },
        
                                save: {
                                    label: "",
                                    class: "primary fas fa-plus btn-floating mr-2"
                                }
                            },

                            {
                                ready: () => {
                                    $btn.css("cursor", "pointer");
                                    Centauri.Components.CreateNewInlineComponent();
                                },

                                save: function() {
                                    if(Centauri.isNull(Centauri.Helper.ModalHelper.Element)) {
                                        toastr["error"]("Content Elements Error", "Please select any element in order to create one!");
                                        return;
                                    }

                                    let $modal = $("#modal");
                                    $modal.hide();

                                    Centauri.fn.Modal.close();
                                    let datas = Centauri.Helper.FieldsHelper($(Centauri.Helper.ModalHelper.Element), ".bottom");

                                    let tempArr = [];

                                    Object.keys(datas).forEach((data) => {
                                        tempArr.push(datas[data]);
                                    });

                                    let jsonDatas = JSON.stringify(tempArr);

                                    Centauri.fn.Ajax(
                                        "ContentElements",
                                        "newElement",

                                        {
                                            pid: Centauri.Components.PagesComponent.uid,
                                            ctype: Centauri.Helper.ModalHelper.Element.data("ctype"),
                                            datas: jsonDatas,

                                            rowPos: rowPos,
                                            colPos: colPos,
                                            insert: insert,
                                            sorting: sorting,
                                            type: type,
                                            gridsorting: gridsorting
                                        },

                                        {
                                            success: function(data) {
                                                data = JSON.parse(data);
                                                Centauri.Notify(data.type, data.title, data.description);

                                                Centauri.Helper.findByPidHelper(Centauri.Components.PagesComponent.uid);
                                            },

                                            error: function(data) {
                                                console.error(data);
                                            }
                                        }
                                    );
                                }
                            }
                        );

                        /**
                         * Initializing CKEditor 5
                         */
                        Centauri.Service.CKEditorInitService();

                        $(".element .top").on("click", function() {
                            var $this = $(this);
                            var $element = $this.parent();

                            $(Centauri.Helper.ModalHelper.Element).find("> .bottom").slideUp();

                            if(!$(Centauri.Helper.ModalHelper.Element).is($element)) {
                                Centauri.Helper.ModalHelper.Element = $element;
                                $("> .bottom", $element).slideToggle();

                                if(Centauri.isUndefined($element.attr("initialized"))) {
                                    $element.attr("initialized", "true");
                                    Centauri.View.ContentElementsView($element);
                                }
                            } else {
                                Centauri.Helper.ModalHelper.Element = null;
                            }
                        });
                    }
                }
            );
        }
    });
};
