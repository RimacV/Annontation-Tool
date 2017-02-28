"use strict"

class AnnotationController {

    constructor() {
        //monkeypatch 
        jQuery.fn.reverse = [].reverse;
        
        this.annotations = []
        this.imageAnnotationMap = new Map();
        this.imageId = 0;
        this.selectionLock = true
        this.getImageList()
        this.numberOfImages = $('#fileList').children().length
        this.selectorInstance = this.intitalizeRoiSelector()
        this.initializeTextBoxBlurHandler()
        this.configureArrowButtons()
        this.configureButtonShortcuts()
        this.configureButtons()
        this.initCanvas()

        $('#selectionLock').click(() =>{
            if($("#selectionLock").is(':checked')){
                 this.selectionLockIsChecked = true
                 this.selectorInstance.setOptions({
                    resizable : false,
                    persistent: true,
                    keys: true
                 })
                 this.selectorInstance.update()
            }else{
                this.selectionLockIsChecked = false
                this.selectorInstance.setOptions({
                    resizable : true,
                    persistent: false,
                    keys: true
                 })
                 this.selectorInstance.update()
            }
        })

    }

    registerAnnotianListClickEvent() {
        $("#annotationList li").click((event) => {
            const index = parseInt($(event.currentTarget).text())

            if ($(event.currentTarget).attr('class') === 'selectedAnnotation') {
                $(event.currentTarget).removeClass("selectedAnnotation")
                this.imageAnnotationMap.get(this.imageId).annotations[index - 1].setOptions({ strokeStyle: '#FF0000' })
            } else {
                $(event.currentTarget).addClass("selectedAnnotation")
                this.imageAnnotationMap.get(this.imageId).annotations[index - 1].setOptions({ strokeStyle: '#0000FF' })
            }

            this.drawAnnontations()
        })
    }

    drawAnnontations() {
        let stage = new Facade(document.querySelector('canvas'));
        this.imageAnnotationMap.get(this.imageId).annotations.forEach(rect => {
            stage.addToStage(rect);
        })

    }
    getImageList() {
        const params = {
            url: 'imageList',
            type: 'GET',
            success: (data) => {
                this.currentlyLoadedImage = data[0]
                data.forEach((imageName, index) => {
                    this.imageAnnotationMap.set(index, {
                        imageName: imageName,
                        annotations: []
                    })
                })
            }
        }
        $.ajax(params)
    }

    initializeTextBoxBlurHandler() {
        $('#roi-x1-textbox').blur(() => {
            this.x1 = $('#roi-x1-textbox').val()
            this.selectorInstance.setSelection(this.x1, this.y1, this.x2, this.y2)
            this.selectorInstance.update()
        });


        $('#roi-y1-textbox').blur(() => {
            this.y1 = $('#roi-y1-textbox').val()
            this.selectorInstance.setSelection(this.x1, this.y1, this.x2, this.y2)
            this.selectorInstance.update()
        });


        $('#roi-x2-textbox').blur(() => {
            this.x2 = $('#roi-x2-textbox').val()
            this.selectorInstance.setSelection(this.x1, this.y1, this.x2, this.y2)
            this.selectorInstance.update()
        });


        $('#roi-y2-textbox').blur(() => {
            this.y2 = $('#roi-y2-textbox').val()
            this.selectorInstance.setSelection(this.x1, this.y1, this.x2, this.y2)
            this.selectorInstance.update()
        });
    }
    initCanvas() {
        let c = document.getElementById("canvas");
        let ctx = c.getContext("2d");
        let img = document.getElementById("displayedImage");
        c.width = $("#displayedImage").width();
        c.height = $("#displayedImage").height();
        ctx.drawImage(img, 0, 0);
    }

    intitalizeRoiSelector() {
        let selectorInstance = $('#displayedImage').imgAreaSelect({
            onSelectEnd: (img, selection) => {
                this.x1 = selection.x1
                this.y1 = selection.y1
                this.x2 = selection.x2
                this.y2 = selection.y2
                this.setRoiTextboxValues(selection.x1, selection.y1, selection.x2, selection.y2)
            },
            instance: true
        })
        return selectorInstance;
    }

    setRoiTextboxValues(x1, y1, x2, y2) {
        $('#roi-x1-textbox').val(x1)
        $('#roi-y1-textbox').val(y1)
        $('#roi-x2-textbox').val(x2)
        $('#roi-y2-textbox').val(y2)
    }


    configureButtons() {
        $("#submit-button").click(() => {
            let annotations = []
            this.imageAnnotationMap.get(this.imageId).annotations.forEach(rect => {
                annotations.push({
                    x1: rect._metrics.x,
                    y1: rect._metrics.y,
                    x2: rect._metrics.width + rect._metrics.x - 1, // Facade adds one pixel for the border, we have to subtract it here
                    y2: rect._metrics.height + rect._metrics.y - 1
                })
            })

            const params = {
                url: '/annotation',
                type: 'PUT',
                dataType: 'json',
                data: { annotations: annotations },
                success: function (result) {
                    // Do something with the result
                }
            }
            $.ajax(params)
            this.initCanvas()
            this.drawAnnontations()
        });
        // 183 143 136 101
        $("#roi-button").click(() => {
            let stage = new Facade(document.querySelector('canvas'));
            let rect = new Facade.Rect(
                {
                    x: this.x1,
                    y: this.y1,
                    width: Math.abs(this.x1 - this.x2),
                    height: Math.abs(this.y1 - this.y2),
                    lineWidth: 1,
                    strokeStyle: '#FF0000',
                    fillStyle: 'transparent',
       
                }

            );
            stage.addToStage(rect);
            this.imageAnnotationMap.get(this.imageId).annotations.push(rect)
            $('#annotationList li').off("click")
            $("#annotationList").append($('<li>').text(this.imageAnnotationMap.get(this.imageId).annotations.length))
            this.registerAnnotianListClickEvent()
        })


        $("#next-button").click(() => {
            this.unselectAnnotations()
            if (this.imageId + 1 < this.numberOfImages) {
                this.imageId += 1
            } else {
                this.imageId = this.numberOfImages - 1;
            }
            let imageUrl = `/image/${this.imageAnnotationMap.get(this.imageId).imageName}`
            $("#annotationList").empty()
            this.getImage(imageUrl)

        })

        $("#previous-button").click(() => {
            this.unselectAnnotations()
            if (this.imageId - 1 >= 0) {
                this.imageId -= 1
            } else {
                this.imageId = 0;
            }
            let imageUrl = `/image/${this.imageAnnotationMap.get(this.imageId).imageName}`
            $("#annotationList").empty()
            this.getImage(imageUrl)

        })

        $("#delete-Annotation-button").click(() => {    
            
            $("#annotationList li").reverse().each((index, element) => {
                if ($(element).attr('class') === 'selectedAnnotation') {
                    const annotationNr = parseInt($(element).text()) - 1
                    const annotations = this.imageAnnotationMap.get(this.imageId).annotations.splice(annotationNr, 1)
                }

            })
            $('#annotationList li').off("click")
            $("#annotationList").empty()
            this.initCanvas()
            this.drawAnnontations()

            this.imageAnnotationMap.get(this.imageId).annotations.forEach((annotation, index) => {
                $("#annotationList").append($('<li>').text(index + 1))
            })
            this.registerAnnotianListClickEvent()
            this.setRoiTextboxValues("", "", "", "")
        })

    }

    unselectAnnotations() {
        $("#annotationList li").each((index, element) => {
            $(element).removeClass("selectedAnnotation")
        })
        this.imageAnnotationMap.get(this.imageId).annotations.forEach(rect => {
            rect.setOptions({ strokeStyle: '#FF0000' })
        })
    }

    getImage(imageUrl) {
        const params = {
            url: imageUrl,
            type: 'GET',
            contentType: 'image/png',
            success: (data) => {
                $("#displayedImage").attr("src", "data:image/png;base64," + data);
                this.initCanvas()
                this.drawAnnontations()

                this.imageAnnotationMap.get(this.imageId).annotations.forEach((annotation, index) => {
                    $("#annotationList").append($('<li>').text(index + 1))
                })
                this.registerAnnotianListClickEvent()
                if(! this.selectionLockIsChecked){
                    this.selectorInstance.cancelSelection()
                }
                this.setRoiTextboxValues("", "", "", "")
            }
        }
        $.ajax(params)
    }


    configureArrowButtons() {
        let fileEntries = $('#fileList').children();
        let liSelected = $('.selected');
        $(window).keydown(function (e) {
            if (e.which === 83) {
                var next = liSelected.next();
                if (next.length > 0) {
                    liSelected.removeClass('selected');
                    liSelected = next.addClass('selected');
                }
                $("#next-button").trigger("click");

            } else if (e.which === 87) {
                var next = liSelected.prev();
                if (next.length > 0) {
                    liSelected.removeClass('selected');
                    liSelected = next.addClass('selected');
                }
                $("#previous-button").trigger("click");
            }
            
        })
    }

    configureButtonShortcuts() {
        $(window).keypress(function (e) {
            if (e.which == 13) {
                $("#submit-button").trigger("click");
            }
        })

        $(window).keypress(function (e) {
            if (e.which == 97) {
                $("#roi-button").trigger("click");
            }
        })


    }

}



