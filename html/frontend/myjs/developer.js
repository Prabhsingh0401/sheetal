function swal(status, message, extra = false, reffer = false) {
    if (extra == false) {
        Swal.fire({
            title: message,
            showConfirmButton: true,
        })
    } else {
        Swal.fire({
            title: message,
            showConfirmButton: true,
            allowOutsideClick: false,
            confirmButtonText: 'Go To Dashboard',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.replace(reffer);
            }
        })
    }
}
function message(status, message) {
    if (status == "success") {
        $(".customMessage").removeClass("showError");
        $(".customMessage").addClass("showSuccess");
    } else {
        $(".customMessage").removeClass("showSuccess");
        $(".customMessage").addClass("showError");
    }
    $(".customMessage").html(message);
    $(".customMessage").show().delay(8000).fadeOut();
}
function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
$(document).ready(function() {
    $("#reviewForm").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
        },
        submitHandler: function(form) {
            var val = $(".submitReviewForm").val();
            $(".submitReviewForm").val("Please Wait...");
            $(".submitReviewForm").attr("disabled", "disabled");
            var formData = new FormData($("#reviewForm")[0]);
            formData.append('_token', token);
            $.ajax({
                type: 'POST',
                url: baseUrl + "/review-form",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                context: this,
                success: function(data) {
                    var json = $.parseJSON(data);
                    if (json.status == "success") {
                        $(".submitReviewForm").val(val);
                        $(".submitReviewForm").removeAttr("disabled");
                        $("#reviewForm").trigger("reset");
                        $('#reviewForm').trigger("change");
                        swal("success", json.message);
                    } else {
                        $(".submitReviewForm").val(val);
                        $(".submitReviewForm").removeAttr("disabled");
                        swal("error", json.message);
                    }
                }
            });
        }
    });
    
    $("#enquireForm").validate({
        rules: {
            name: {
                required: true,
            },
            mobile: {
                required: true,
            },
            email: {
                required: true,
                email: true
            },
        },
        submitHandler: function(form) {
            var val = $(".enquireFormSubmit").val();
            $(".enquireFormSubmit").val("Please Wait...");
            $(".enquireFormSubmit").attr("disabled", "disabled");
            var formData = new FormData($("#enquireForm")[0]);
            formData.append('_token', token);
            $.ajax({
                type: 'POST',
                url: baseUrl + "/enquire-form-submit",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                context: this,
                success: function(data) {
                    var json = $.parseJSON(data);
                    if (json.status == "success") {
                        $(".enquireFormSubmit").val(val);
                        $(".enquireFormSubmit").removeAttr("disabled");
                        $("#enquireForm").trigger("reset");
                        $('#enquireForm').trigger("change");
                        $('#myModal .close').trigger("click");
                        swal("success", json.message);
                    } else {
                        $(".enquireFormSubmit").val(val);
                        $(".enquireFormSubmit").removeAttr("disabled");
                        swal("error", json.message);
                    }
                }
            });
        }
    });
    
});
$(document).on('click', '.mgooxxbjga', function() {
    var offset = $(this).attr("data-offset");
    var seo = $(".cuxxgzsxvu").val();
    var html = $(this).html();
    $(".mgooxxbjga").html("Loading...");
    $.ajax({
        type: 'POST',
        url: baseUrl + "/load-more-products",
        data: "offset=" + offset + "&seo=" + seo + "&_token=" + token,
        context: this,
        success: function(data) {
            if ($.trim(data) == "") {
                swal("error", "No More Products");
                $(".mgooxxbjga").html(html);
                return false;
            }
            $(".mgooxxbjga").html(html);
            $(".gjbwdjhpzp").append(data);
            $(".mgooxxbjga").attr("data-offset", parseInt(offset) + 12);
        },
        error: function(data) {}
    });
});
$(document).on('click', '.rsmxosilmp', function() {
    $("#reviewModal").modal("show");
});
$(document).on('click', '.zhyituilng', function() {
    var brand = $(this).attr("data-id");
    $(".mgooxxbjga").attr("data-offset", 0);
    var offset = $(".mgooxxbjga").attr("data-offset");
    $(".zhyituilng").removeClass("activeFilter");
    $.ajax({
        type: 'POST',
        url: baseUrl + "/set-session-filter",
        data: "brand=" + brand + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                $(this).addClass("activeFilter");
                $(".zrqdqaouhe").load(location.href + " .zrqdqaouhe");
                $(".lazfeyfoll").load(location.href + " .lazfeyfoll");
                $(".dujygeuhzi").html('+');
                //$(".filter-dd").hide();
                $('html, body').animate({
                    scrollTop: $(".zrqdqaouhe").offset().top-200
                }, 100);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.trrysfceku', function() {
    var size = $(this).attr("data-id");
    $(".mgooxxbjga").attr("data-offset", 0);
    var offset = $(".mgooxxbjga").attr("data-offset");
    $(".trrysfceku").removeClass("activeFilter");
    $.ajax({
        type: 'POST',
        url: baseUrl + "/set-session-filter",
        data: "size=" + size + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                $(this).addClass("activeFilter");
                $(".zrqdqaouhe").load(location.href + " .zrqdqaouhe");
                $(".lazfeyfoll").load(location.href + " .lazfeyfoll");
                $(".dujygeuhzi").html('+');
                //$(".filter-dd").hide();
                $('html, body').animate({
                    scrollTop: $(".zrqdqaouhe").offset().top-200
                }, 100);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.wfiubzkfst', function() {
    var sort = $(this).attr("data-id");
    $(".mgooxxbjga").attr("data-offset", 0);
    var offset = $(".mgooxxbjga").attr("data-offset");
    $(".wfiubzkfst").removeClass("activeFilter");
    $.ajax({
        type: 'POST',
        url: baseUrl + "/set-session-filter",
        data: "sort=" + sort + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                $(this).addClass("activeFilter");
                $(".zrqdqaouhe").load(location.href + " .zrqdqaouhe");
                $(".lazfeyfoll").load(location.href + " .lazfeyfoll");
                $(".dujygeuhzi").html('+');
                //$(".filter-dd").hide();
                $('html, body').animate({
                    scrollTop: $(".zrqdqaouhe").offset().top-200
                }, 100);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.inzbnhcrrt', function() {
    $(".wfiubzkfst").removeClass("activeFilter");
    $(".zhyituilng").removeClass("activeFilter");
    $(".trrysfceku").removeClass("activeFilter");
    $.ajax({
        type: 'POST',
        url: baseUrl + "/remove-session-filter",
        data: "_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                $(".zrqdqaouhe").load(location.href + " .zrqdqaouhe");
                $(".lazfeyfoll").load(location.href + " .lazfeyfoll");
                $(".dujygeuhzi").html('+');
                //$(".filter-dd").hide();
                $('html, body').animate({
                    scrollTop: $(".zrqdqaouhe").offset().top-200
                }, 100);
            }
        },
        error: function(data) {}
    });
});
$("[type='number']").keypress(function (evt) {
    evt.preventDefault();
});
$("[type='number']").blur(function (evt) {
    if($(this).val()=="" || $(this).val() < 1){
        $(this).val(1);
    }
});
$(document).on('click', '.zavtmwpmsp', function() {
    var id = $(this).attr("data-id");
    var quantity = 1;
    var extra = $(".mdiczdytgv").val();
    var extraId = $('option:selected','.mdiczdytgv').attr('data-id');
    var type = "plus";
    var html = $(this).html();
    if(!$.isNumeric(quantity) || quantity < 1){
        message("error","Please enter quantity properly");
        return false;
    }
    $(this).html('<i class="fa fa-spinner" aria-hidden="true"></i>');
    $.ajax({
        type: 'POST',
        url: baseUrl + "/add-to-cart",
        data: "_token=" + token + "&id=" + id + "&quantity=" + quantity + "&type=" + type + "&extra=" + extra + "&extraId=" + extraId,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                $(".doghvwgmxh").html(json.countInCart);
                $(".bbybqdnnbr").load(location.href + " .bbybqdnnbr");
                $(this).html('Added to cart');
                $(".liswntfimo").load(location.href + " .liswntfimo");
                $('.ipgkvlkbzj').addClass('cart-box-open');
                $('.ipgkvlkbzj').removeAttr('style');
                $("#bbybqdnnbr").load(" #bbybqdnnbr > *");
                $("#adjhblttnb").load(" #adjhblttnb > *");
                if ($('.ipgkvlkbzj').is(':visible')) {
                    //$(".twksebluco").trigger('click');
                } else {
                    $(".twksebluco").trigger('click');
                }
                /*setTimeout(function() {
                    $(".close-box").trigger('click');
                }, 2500);*/
                //$(".ipgkvlkbzj").show();
                message("success", json.message);
            } else {
                message("error", json.message);
                $(this).html(html);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.umpztwnsag', function() {
    var id = $(this).attr("data-id");
    var quantity = $(".vjmusiimhq").val();
    var extra = $(".mdiczdytgv").val();
    var extraId = $('option:selected','.mdiczdytgv').attr('data-id');
    var type = "plus";
    var html = $(this).html();
    if(!$.isNumeric(quantity) || quantity < 1){
        message("error","Please enter quantity properly");
        return false;
    }
    $(this).html('<i class="fa fa-spinner" aria-hidden="true"></i>');
    $.ajax({
        type: 'POST',
        url: baseUrl + "/add-to-cart",
        data: "_token=" + token + "&id=" + id + "&quantity=" + quantity + "&type=" + type + "&extra=" + extra + "&extraId=" + extraId,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                $(".doghvwgmxh").html(json.countInCart);
                $(".bbybqdnnbr").load(location.href + " .bbybqdnnbr");
                $(".liswntfimo").load(location.href + " .liswntfimo");
                $(this).html(html);
                $(".liswntfimo").load(location.href + " .liswntfimo");
                $('.ipgkvlkbzj').addClass('cart-box-open');
                $('.ipgkvlkbzj').removeAttr('style');
                $("#adjhblttnb").load(" #adjhblttnb > *");
                if ($('.ipgkvlkbzj').is(':visible')) {
                    //$(".twksebluco").trigger('click');
                } else {
                    $(".twksebluco").trigger('click');
                }
                //$(".twksebluco").trigger('click');
                /*setTimeout( () => {
                  $(".close-box").trigger('click');
                }, 2000);*/
                /*setTimeout(function() {
                    $(".close-box").trigger('click');
                }, 2500);*/
                //$(".ipgkvlkbzj").show();
                message("success", json.message);
            } else {
                message("error", json.message);
                $(this).html(html);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.close-box', function() {
    $('.ipgkvlkbzj').attr('style','display: none !important');
    $('.ipgkvlkbzj').removeClass('cart-box-open');
});
$(document).on('click', '.twksebluco', function() {
    $('.ipgkvlkbzj').removeAttr('style');
});    
$(document).on('click', '.dykbftllzc', function() {
    var id = $(this).attr("data-id");
    var extra = $(this).attr("data-extra");
    var extraId = $(this).attr("data-extraId");
    var quantity = 1;
    var type = "minus";
    $.ajax({
        type: 'POST',
        url: baseUrl + "/add-to-cart",
        data: "_token=" + token + "&id=" + id + "&quantity=" + quantity + "&type=" + type + "&extra=" + extra + "&extraId=" + extraId,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                $(".doghvwgmxh").html(json.countInCart);
                var qty = $(".esaidwpsro" + id+"_"+extraId).html();
                if (parseInt(qty) == 1) {
                    $("#product" + id +"_"+extraId).remove();
                }
                $(".esaidwpsro" + id +"_"+extraId).html(parseInt(qty) - 1);
                $(".zokmrexzsu" + id +"_"+extraId).html(addCommas(json.productTotal));
                var newQty = $(".product" + id +"_"+extraId).html();
                if(newQty == 0){
                    $(".product" + id +"_"+extraId).remove();
                }
                if($(".yccktufhxu").length == 0){
                    window.location.href = baseUrl+'/cart';
                }
                $("#bbybqdnnbr").load(" #bbybqdnnbr > *");
                $("#adjhblttnb").load(" #adjhblttnb > *");
                
                $(".cswuihbbqs").val("");
                message("success", json.message);
            } else {
                message("error", json.message);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.wjlmwqysjg', function() {
    var id = $(this).attr("data-id");
    var extra = $(this).attr("data-extra");
    var extraId = $(this).attr("data-extraId");
    var quantity = 1;
    var type = "plus";
    $.ajax({
        type: 'POST',
        url: baseUrl + "/add-to-cart",
        data: "_token=" + token + "&id=" + id + "&quantity=" + quantity + "&type=" + type + "&extra=" + extra + "&extraId=" + extraId,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                $(".doghvwgmxh").html(json.countInCart);
                var qty = $(".esaidwpsro" + id+"_"+extraId).html();
                $(".esaidwpsro" + id +"_"+extraId).html(parseInt(qty) + 1);
                $(".zokmrexzsu" + id +"_"+extraId).html(addCommas(json.productTotal));
                //$(".bbybqdnnbr").load(location.href + " .bbybqdnnbr");
                $("#bbybqdnnbr").load(" #bbybqdnnbr > *");
                $("#adjhblttnb").load(" #adjhblttnb > *");
                $(".cswuihbbqs").val("");
                message("success", json.message);
            } else {
                message("error", json.message);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.f-name', function() {
    var html = $.trim($(this).find(".dujygeuhzi").html());
    if (html == "+") {
        $(this).find(".dujygeuhzi").html("-");
    } else {
        $(this).find(".dujygeuhzi").html("+");
    }
});
$(document).on('click', '.customZoomFunction', function() {
    var index = $(this).attr("data-index");
    var content = '<div>';
    content += '<div class="customZoomFunctionClose">X</div>';
    if(zoomUrl.length > 1){
    content += '<div class="customZoomFunctionPrev"><</div>';
    content += '<div class="customZoomFunctionNext">></div>';
    }
    content += '<div class="main-img"><img class="currentZoomImageSrc" data-id="' + index + '" src="' + zoomUrl[index] + '"></div>';
    content += '<div class="filter-bg" style="background:url(' + zoomUrl[index] + ')"></div>';
    content += '<div class="bottomCaption">' + zoomUrlCaption[index] + '</div>';
    content += '</div>';
    var holder = '<div class="customZoomFunctionHolder" style="">' + content + '</div>';
    $(holder).hide().appendTo("body").fadeIn(300);
    $('body').css("overflow", "hidden");

});
$(document).on('click', '.customZoomFunctionClose', function() {
    $('.customZoomFunctionHolder').fadeOut(300, function() {
        $(this).remove();
    });;
    $('body').removeAttr("style");
    $('html').removeAttr("style");
});
$(document).on('click', '.customZoomFunctionPrev', function() {
    var currentZoomImageSrc = $(".currentZoomImageSrc").attr("data-id");
    if (currentZoomImageSrc == 0) {
        //$(".customZoomFunctionClose").trigger('click');
        return false;
    }
    var newIndex = parseInt(currentZoomImageSrc) - parseInt(1);
    $(".currentZoomImageSrc").attr("data-id", newIndex);
    $(".currentZoomImageSrc").attr("src", zoomUrl[newIndex]);
    $(".filter-bg").css("background", "url(" + zoomUrl[newIndex] + ")");
    $(".bottomCaption").html(zoomUrlCaption[newIndex]);
});
$(document).on('click', '.customZoomFunctionNext', function() {
    if (zoomUrl.length > 1) {
        var currentZoomImageSrc = $(".currentZoomImageSrc").attr("data-id");
        var newIndex = parseInt(currentZoomImageSrc) + parseInt(1);
        if ((zoomUrl.length - newIndex) == 0) {
            //$(".customZoomFunctionClose").trigger('click');
            return false;
        }
        $(".currentZoomImageSrc").attr("data-id", newIndex);
        $(".currentZoomImageSrc").attr("src", zoomUrl[newIndex]);
        $(".filter-bg").css("background", "url(" + zoomUrl[newIndex] + ")");
        $(".bottomCaption").html(zoomUrlCaption[newIndex]);
    }
});
$(document).on('click', '.kkhjowhxxh', function() {
    $(".afhnheugug").fadeToggle();
    $(".nbbzvuwbeu").focus();
});
$(document).on('keyup', '.nbbzvuwbeu', function() {
    var val = $(this).val();
    if ($.trim(val) == "") {
        $(".jqfayddvcx").html("");
    } else {
        $.ajax({
            type: 'POST',
            url: baseUrl + "/search",
            data: "val=" + val + "&_token=" + token,
            context: this,
            success: function(data) {
                $(".jqfayddvcx").html(data);
            },
            error: function(data) {}
        });
    }
});
$(document).ready(function() {
    $("#informationUpdateForm").validate({
        rules: {
            name: {
                required: true,
            },
            email: {
                required: true,
                email: true
            },
            mobile: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10,
            },
        },
        submitHandler: function(form) {
            var val = $("#submitInformationUpdateForm").val();
            $("#submitInformationUpdateForm").val("Please Wait...");
            $("#submitInformationUpdateForm").attr("disabled", "disabled");
            var formData = new FormData($("#informationUpdateForm")[0]);
            formData.append('_token', token);
            $.ajax({
                type: 'POST',
                url: baseUrl + "/send-personal-information",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                context: this,
                success: function(data) {
                    var json = $.parseJSON(data);
                    if (json.status == "success") {
                        $("#submitInformationUpdateForm").val(val);
                        $("#submitInformationUpdateForm").removeAttr("disabled");
                        $("#informationUpdateForm").trigger("reset");
                        $('#informationUpdateForm').trigger("change");
                        swal("success", json.message);
                    } else {
                        $("#submitInformationUpdateForm").val(val);
                        $("#submitInformationUpdateForm").removeAttr("disabled");
                        swal("error", json.message);
                    }
                }
            });
        }
    });
});
$(document).ready(function() {
    $("#addressUpdateForm").validate({
        rules: {
            name: {
                required: true,
            },
            email: {
                required: true,
                email: true
            },
            mobile: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10,
            },
            address1: {
                required: true,
            },
            city: {
                required: true,
            },
            pincode: {
                required: true,
                digits: true,
                minlength: 6,
                maxlength: 6,
            },
        },
        submitHandler: function(form) {
            var val = $("#submitAddressUpdateForm").val();
            $("#submitAddressUpdateForm").val("Please Wait...");
            $("#submitAddressUpdateForm").attr("disabled", "disabled");
            var formData = new FormData($("#addressUpdateForm")[0]);
            formData.append('_token', token);
            $.ajax({
                type: 'POST',
                url: baseUrl + "/add-new-user-address",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                context: this,
                success: function(data) {
                    var json = $.parseJSON(data);
                    if (json.status == "success") {
                        $("#submitAddressUpdateForm").val(val);
                        $("#submitAddressUpdateForm").removeAttr("disabled");
                        $("#addressUpdateForm").trigger("reset");
                        $('#addressUpdateForm').trigger("change");
                        $(".pabkygdtep").load(location.href + " .pabkygdtep");
                        $("input[name='update_id']").val(0);
                        $(".zerrzjcoex").modal('hide');
                        
                        if(json.reffer!=""){
                            window.location.replace(json.reffer);
                        }else{
                            swal("success", json.message);
                        }
                    } else {
                        $("#submitAddressUpdateForm").val(val);
                        $("#submitAddressUpdateForm").removeAttr("disabled");
                        swal("error", json.message);
                    }
                }
            });
        }
    });
});
$(document).ready(function() {
    $("#loginForm").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
            },
        },
        submitHandler: function(form) {
            var val = $("#loginSubmit").val();
            $("#loginSubmit").val("Please Wait...");
            $("#loginSubmit").attr("disabled", "disabled");
            var formData = new FormData($("#loginForm")[0]);
            formData.append('_token', token);
            $.ajax({
                type: 'POST',
                url: baseUrl + "/login-user",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                context: this,
                success: function(data) {
                    var json = $.parseJSON(data);
                    if (json.status == "success") {
                        $("#loginSubmit").val(val);
                        $("#loginSubmit").removeAttr("disabled");
                        $("#loginForm").trigger("reset");
                        $('#loginForm').trigger("change");
                        if ($("#loginSubmit").hasClass('zodhppkico')) {
                            location.reload();
                        } else {
                            window.location.replace(json.reffer);
                        }
                    } else {
                        $("#loginSubmit").val(val);
                        $("#loginSubmit").removeAttr("disabled");
                        swal("error", json.message);
                    }
                }
            });
        }
    });
});
$(document).ready(function() {
    $("#registerForm").validate({
        rules: {
            firstname: {
                required: true,
            },
            lastname: {
                required: true,
            },
            email: {
                required: true,
                email: true
            },
            mobile: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10,
            },
            password: {
                required: true,
                minlength: 8
            },
        },
        submitHandler: function(form) {
            var val = $("#registerSubmit").val();
            $("#registerSubmit").val("Please Wait...");
            $("#registerSubmit").attr("disabled", "disabled");
            var formData = new FormData($("#registerForm")[0]);
            formData.append('_token', token);
            $.ajax({
                type: 'POST',
                url: baseUrl + "/register-user",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                context: this,
                success: function(data) {
                    var json = $.parseJSON(data);
                    if (json.status == "success") {
                        $("#registerSubmit").val(val);
                        $("#registerSubmit").removeAttr("disabled");
                        $("#registerForm").trigger("reset");
                        $('#registerForm').trigger("change");
                        //swal("success", json.message, true, json.reffer);
                        window.location.replace(json.reffer);
                    } else {
                        if(json.status == 'false'){
                            $(".customErrorMessage").hide();
                            $.each(json.data, function(i, item) {
                                console.log(item);
                                if(json.data[i] == 'Email already exists.'){
                                    $(".itawjnbedj").show();
                                    $(".itawjnbedj").html('Email already exists.');
                                    $(".itawjnbedj").parent().find('.vthqssqdrv').addClass('border-red-error');
                                }else if(json.data[i] == 'Mobile already exists.'){
                                    $(".klqxmtgoav").show();
                                    $(".klqxmtgoav").html('Mobile already exists.');
                                    $(".klqxmtgoav").parent().find('.vthqssqdrv').addClass('border-red-error');
                                }
                            });
                        }else{
                            $("#registerSubmit").val(val);
                            $("#registerSubmit").removeAttr("disabled");
                            swal("success", json.message);
                        }
                        $("#registerSubmit").val(val);
                        $("#registerSubmit").removeAttr("disabled");
                        
                    }
                }
            });
        }
    });
});
$(document).ready(function() {
    $("#forgotForm").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
        },
        submitHandler: function(form) {
            var val = $("#forgotSubmit").val();
            $("#forgotSubmit").val("Please Wait...");
            $("#forgotSubmit").attr("disabled", "disabled");
            var formData = new FormData($("#forgotForm")[0]);
            formData.append('_token', token);
            $.ajax({
                type: 'POST',
                url: baseUrl + "/forgot-user-password",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                context: this,
                success: function(data) {
                    var json = $.parseJSON(data);
                    if (json.status == "success") {
                        $("#forgotSubmit").val(val);
                        $("#forgotSubmit").removeAttr("disabled");
                        $("#forgotForm").trigger("reset");
                        $('#forgotForm').trigger("change");
                        swal("success", json.message);
                    } else {
                        $("#forgotSubmit").val(val);
                        $("#forgotSubmit").removeAttr("disabled");
                        swal("error", json.message);
                    }
                }
            });
        }
    });
    $("#changePasswordForm").validate({
        rules: {
            password: {
                minlength: 8,
            },
            passwordConfirm: {
                minlength: 8,
                equalTo: "#password"
            }
        },
        submitHandler: function(form) {
            var val = $("#changePasswordSubmit").val();
            $("#changePasswordSubmit").val("Please Wait...");
            $("#changePasswordSubmit").attr("disabled", "disabled");
            var formData = new FormData($("#changePasswordForm")[0]);
            formData.append('_token', token);
            $.ajax({
                type: 'POST',
                url: baseUrl + "/change-user-password",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                context: this,
                success: function(data) {
                    var json = $.parseJSON(data);
                    if (json.status == "success") {
                        $("#changePasswordSubmit").val(val);
                        $("#changePasswordSubmit").removeAttr("disabled");
                        $("#changePasswordForm").trigger("reset");
                        $('#changePasswordForm').trigger("change");
                        swal("success", json.message);
                        setTimeout(
                          function() 
                          {
                            window.location.replace(baseUrl+"/login");
                          }, 1500);
                    } else {
                        $("#changePasswordSubmit").val(val);
                        $("#changePasswordSubmit").removeAttr("disabled");
                        swal("error", json.message);
                    }
                }
            });
        }
    });
});
$("#paymentForm").validate({
    rules: {
        productName: {
            required: true,
        },
        price: {
            required: true,
        },
        quantity: {
            required: true,
        },
        name: {
            required: true,
        },
        email: {
            required: true,
            email: true
        },
        mobile: {
            required: true,
            digits: true,
            minlength: 10,
            maxlength: 10,
        },
      
    },
    submitHandler: function(form) {
        var val = $(".submitPaymentForm").val();
        $(".submitPaymentForm").val("Please Wait...");
        $(".submitPaymentForm").attr("disabled", "disabled");
        var formData = new FormData($("#paymentForm")[0]);
        formData.append('_token', token);
        $.ajax({
            type: 'POST',
            url: baseUrl + "/submit-payment-data",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            context: this,
            success: function(data) {
                var json = $.parseJSON(data);
                if (json.status == "success") {
                    $(".submitPaymentForm").val(val);
                    $(".submitPaymentForm").removeAttr("disabled");
                    $("#paymentForm").trigger("reset");
                    $('#paymentForm').trigger("change");
                    swal("success", json.message);
                } else {
                    $(".submitPaymentForm").val(val);
                    $(".submitPaymentForm").removeAttr("disabled");
                    swal("error", json.message);
                }
            }
        });
    }
});
$("#contactForm").validate({
    rules: {
        name: {
            required: true,
        },
        email: {
            required: true,
            email: true
        },
        mobile: {
            required: true,
            digits: true,
            minlength: 10,
            maxlength: 10,
        },
        message: {
            required: true,
        },
    },
    submitHandler: function(form) {
        var val = $(".submitContactForm").val();
        $(".submitContactForm").val("Please Wait...");
        $(".submitContactForm").attr("disabled", "disabled");
        var formData = new FormData($("#contactForm")[0]);
        formData.append('_token', token);
        $.ajax({
            type: 'POST',
            url: baseUrl + "/submit-contact-us-query",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            context: this,
            success: function(data) {
                var json = $.parseJSON(data);
                if (json.status == "success") {
                    $(".submitContactForm").val(val);
                    $(".submitContactForm").removeAttr("disabled");
                    $("#contactForm").trigger("reset");
                    $('#contactForm').trigger("change");
                    swal("success", json.message);
                } else {
                    $(".submitContactForm").val(val);
                    $(".submitContactForm").removeAttr("disabled");
                    swal("error", json.message);
                }
            }
        });
    }
});
$("#customizeForm").validate({
    rules: {
        name: {
            required: true,
        },
        email: {
            required: true,
            email: true
        },
        mobile: {
            required: true,
            digits: true,
            minlength: 10,
            maxlength: 10,
        },
        type: {
            required: true,
        },
        quantity: {
            required: true,
        },
    },
    submitHandler: function(form) {
        var val = $(".submitCustomizeForm").val();
        $(".submitCustomizeForm").val("Please Wait...");
        $(".submitCustomizeForm").attr("disabled", "disabled");
        var formData = new FormData($("#customizeForm")[0]);
        formData.append('_token', token);
        $.ajax({
            type: 'POST',
            url: baseUrl + "/submit-customize-query",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            context: this,
            success: function(data) {
                var json = $.parseJSON(data);
                if (json.status == "success") {
                    $(".submitCustomizeForm").val(val);
                    $(".submitCustomizeForm").removeAttr("disabled");
                    $("#customizeForm").trigger("reset");
                    $('#customizeForm').trigger("change");
                    swal("success", json.message);
                } else {
                    $(".submitCustomizeForm").val(val);
                    $(".submitCustomizeForm").removeAttr("disabled");
                    swal("error", json.message);
                }
            }
        });
    }
});
$("#bulkOrderForm").validate({
    rules: {
        name: {
            required: true,
        },
        email: {
            required: true,
            email: true
        },
        mobile: {
            required: true,
            digits: true,
            minlength: 10,
            maxlength: 10,
        }
    },
    submitHandler: function(form) {
        var val = $(".submitBulkOrderForm").val();
        $(".submitBulkOrderForm").val("Please Wait...");
        $(".submitBulkOrderForm").attr("disabled", "disabled");
        var formData = new FormData($("#bulkOrderForm")[0]);
        formData.append('_token', token);
        $.ajax({
            type: 'POST',
            url: baseUrl + "/submit-bulk-order-query",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            context: this,
            success: function(data) {
                var json = $.parseJSON(data);
                if (json.status == "success") {
                    $(".submitBulkOrderForm").val(val);
                    $(".submitBulkOrderForm").removeAttr("disabled");
                    $("#bulkOrderForm").trigger("reset");
                    $('#bulkOrderForm').trigger("change");
                    swal("success", json.message);
                } else {
                    $(".submitBulkOrderForm").val(val);
                    $(".submitBulkOrderForm").removeAttr("disabled");
                    swal("error", json.message);
                }
            }
        });
    }
});
$("#stylingForm").validate({
    rules: {
        name: {
            required: true,
        },
        email: {
            required: true,
            email: true
        },
        mobile: {
            required: true,
            digits: true,
            minlength: 10,
            maxlength: 10,
        },
        message: {
            required: true,
        },
    },
    submitHandler: function(form) {
        var val = $(".submitStylingForm").val();
        $(".submitStylingForm").val("Please Wait...");
        $(".submitStylingForm").attr("disabled", "disabled");
        var formData = new FormData($("#stylingForm")[0]);
        formData.append('_token', token);
        $.ajax({
            type: 'POST',
            url: baseUrl + "/submit-styling-form",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            context: this,
            success: function(data) {
                var json = $.parseJSON(data);
                if (json.status == "success") {
                    $(".submitStylingForm").val(val);
                    $(".submitStylingForm").removeAttr("disabled");
                    $("#stylingForm").trigger("reset");
                    $('#stylingForm').trigger("change");
                    swal("success", json.message);
                } else {
                    $(".submitStylingForm").val(val);
                    $(".submitStylingForm").removeAttr("disabled");
                    swal("error", json.message);
                }
            }
        });
    }
});
$("#legitForm").validate({
    rules: {
        name: {
            required: true,
        },
        email: {
            required: true,
            email: true
        },
        mobile: {
            required: true,
            digits: true,
            minlength: 10,
            maxlength: 10,
        },
        message: {
            required: true,
        },
    },
    submitHandler: function(form) {
        var val = $(".submitLegitForm").val();
        $(".submitLegitForm").val("Please Wait...");
        $(".submitLegitForm").attr("disabled", "disabled");
        var formData = new FormData($("#legitForm")[0]);
        formData.append('_token', token);
        $.ajax({
            type: 'POST',
            url: baseUrl + "/submit-legit-form",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            context: this,
            success: function(data) {
                var json = $.parseJSON(data);
                if (json.status == "success") {
                    $(".submitLegitForm").val(val);
                    $(".submitLegitForm").removeAttr("disabled");
                    $("#legitForm").trigger("reset");
                    $('#legitForm').trigger("change");
                    swal("success", json.message);
                } else {
                    $(".submitLegitForm").val(val);
                    $(".submitLegitForm").removeAttr("disabled");
                    swal("error", json.message);
                }
            }
        });
    }
});
$(document).on('click', '.makeDefaultAddress', function() {
    var addressId = $(this).attr("data-id");
    $.ajax({
        type: 'POST',
        url: baseUrl + "/set-default-address",
        data: "addressId=" + addressId + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                $(".makeDefaultAddress img").attr("src", baseUrl+"/frontend/assets/img/tick-grey.png");
                $(this).find('img').attr("src", baseUrl+"/frontend/assets/img/tick-green.png");
                $(".pabkygdtep").load(location.href + " .pabkygdtep");
                swal("success", json.message);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.deleteAddress', function() {
    var addressId = $(this).attr("data-id");
    var defaultAddress = $(this).attr("data-defaultAddress");
    $.ajax({
        type: 'POST',
        url: baseUrl + "/delete-user-address",
        data: "addressId=" + addressId + "&defaultAddress=" + defaultAddress + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                $("#addressList" + addressId).remove();
                
                $(".iygjobpekh").load(location.href + " .iygjobpekh");
                swal("success", json.message);
            } else {
                swal("error", json.message);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.editAddress', function() {
    var addressId = $(this).attr("data-id");
    $.ajax({
        type: 'POST',
        url: baseUrl + "/get-user-address",
        data: "addressId=" + addressId + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                $.each(json.data[0], function(key, data) {
                    $("input[name='" + key + "']").val(data);
                    if (key == "stateId") {
                        $(".gdfjsgqngm").val(data);
                    }
                    if (key == "countryId") {
                        $(".rxnhozyqhi").val(data);
                    }
                    if (key == "default") {
                        $(".duidcoiydf").val(data);
                    }
                    if (key == "addressId") {
                        $("input[name='update_id']").val(data);
                    }
                });
                $(".zerrzjcoex").modal('show');
                /*$('html, body').animate({
                    scrollTop: $("#addressUpdateForm").offset().top
                }, 100);*/
            } else {
                swal("error", json.message);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.fydoyrewcr', function() {
    $(".fydoyrewcr").removeClass('active');
    $(this).addClass('active');
});
$(document).on('click', '.pwovdhwivc', function() {
    var addressId = $(this).attr("data-id");
    var addressType = $(this).attr("data-addressType");
    var checkValue = $(".ajbgzcvbbt").val();
    $.ajax({
        type: 'POST',
        url: baseUrl + "/change-checkout-address",
        data: "addressId=" + addressId + "&addressType=" + addressType + "&checkValue=" + checkValue + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                $('.pwovdhwivc[data-addressType="' + addressType + '"]').removeClass('dawgjjwadt');
                $('.jcaultazip[data-addressType="' + addressType + '"]').css('display', 'none');
                $(this).addClass('dawgjjwadt');
                $(this).parent().find(".jcaultazip").css('display', 'block');
            } else {
                swal("error", json.message);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.ajbgzcvbbt', function() {
    var value = $(this).val();
    if (value == 1) {
        $(this).val(0);
    } else {
        $(this).val(1);
    }
    $.ajax({
        type: 'POST',
        url: baseUrl + "/set-same-billing-address",
        data: "value=" + value + "&_token=" + token,
        context: this,
        success: function(data) {
            if (value == 1) {
                $(".zmcpvjngis").hide();
                $(".gxgtdtknes").load(location.href + " .gxgtdtknes");
            } else {
                $(".zmcpvjngis").show();
                $(".gxgtdtknes").load(location.href + " .gxgtdtknes");
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.ywzgaoyudt', function() {
    var value = $(".cswuihbbqs").val();
    var error = 0;
    if ($.trim(value) == "") {
        error = 1;
        message("error", "Please enter coupon code.");
    }
    if (error == 0) {
        $.ajax({
            type: 'POST',
            url: baseUrl + "/validate-coupon",
            data: "value=" + value + "&_token=" + token,
            context: this,
            success: function(data) {
                var json = $.parseJSON(data);
                if (json.status == "success") {
                    $(".bbybqdnnbr").load(location.href + " .bbybqdnnbr"); 
                    //message("success", json.message);
                    $(".aogvmiivbm").show();
                    $('.aogvmiivbm').delay(5000).fadeOut('slow');
                } else {
                    $(".bbybqdnnbr").load(location.href + " .bbybqdnnbr"); 
                    //message("error", json.message);
                    $(".zrpncbfseh").show();
                    $('.zrpncbfseh').delay(5000).fadeOut('slow');
                }
            },
            error: function(data) {}
        });
    }
});
$(document).on('click', '.zditvjhelc', function() {
    $.ajax({
        type: 'POST',
        url: baseUrl + "/remove-coupon",
        data: "_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                $(".bbybqdnnbr").load(location.href + " .bbybqdnnbr");
                $(".cswuihbbqs").val("");
                message("success", json.message);
            } else {
                message("error", json.message);
            }
        },
        error: function(data) {}
    });
});
/*$(document).on('click', '.placeOrder', function() {
    var html = $(this).html();
    var context = $(this);
    $(this).html('<i class="fa fa-spinner" aria-hidden="true"></i>');
    $.ajax({
        type: 'POST',
        url: baseUrl + "/place-order",
        data: "_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            $(this).html(html);
            if (json.status == "success") {
                //window.location.replace(baseUrl+"/razorpay-payment");
                $('.razorpay-payment-button').trigger("click");
            } else {
                message("error", json.message);
            }
        },
        error: function(data) {}
    });
});*/
$(document).on('click', '.placeOrder', function() {
    var html = $(this).html();
    var context = $(this);
    $(this).html('<i class="fa fa-spinner" aria-hidden="true"></i>');
    if($("#checkoutForm").length == 0) {
        $.ajax({
        type: 'POST',
        url: baseUrl + "/place-order",
        data: "_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            $(this).html(html);
            if (json.status == "success") {
                $("#orderId").val(json.insert_id);
                $("#placeOnlineOrder").trigger('click');
            } else {
                message("error", json.message);
                /*$.each(json.message, function(i, item) {
                    console.log(json.message[i]);
                });*/
            }
        },
        error: function(data) {}
        });
    }else{
        $.ajax({
        type: 'POST',
        url: baseUrl + "/place-order",
        data: $("#checkoutForm").serialize()+"&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            $(this).html(html);
            if (json.status == "success") {
                $("#orderId").val(json.insert_id);
                $("#placeOnlineOrder").trigger('click');
            } else {
                //swal("error", json.message);
                $(".customErrorMessage").hide();
                $.each(json.message, function(i, item) {
                    if(json.message[i] == 'The email field is required.'){
                        $(".emailError").show();
                        $(".emailError").parent().find('.vthqssqdrv').addClass('border-red-error');
                    }else if(json.message[i] == 'The mobile field is required.'){
                        $(".mobileError").show();
                        $(".mobileError").parent().find('.vthqssqdrv').addClass('border-red-error');
                    }else if(json.message[i] == 'The first name field is required.'){
                        $(".firstNameError").show();
                        $(".firstNameError").parent().find('.vthqssqdrv').addClass('border-red-error');
                    }else if(json.message[i] == 'The last name field is required.'){
                        $(".lastNameError").show();
                        $(".lastNameError").parent().find('.vthqssqdrv').addClass('border-red-error');
                    }else if(json.message[i] == 'The city field is required.'){
                        $(".cityError").show();
                        $(".cityError").parent().find('.vthqssqdrv').addClass('border-red-error');
                    }else if(json.message[i] == 'The address1 field is required.'){
                        $(".addressError").show();
                        $(".addressError").parent().find('.vthqssqdrv').addClass('border-red-error');
                    }else if(json.message[i] == 'The pincode field is required.'){
                        $(".pincodeError").show();
                        $(".pincodeError").parent().find('.vthqssqdrv').addClass('border-red-error');
                    }
                });
            }
        },
        error: function(data) {}
    });
    }
    
   
});
$(document).on('blur', '.vthqssqdrv', function() {
    var val = $(this).val();
    if($.trim(val)!=""){
        $(this).next().hide();
        $(this).removeClass('border-red-error');
    }
});
/*$(document).on('click', '.placeOrder', function() {
    var html = $(this).html();
    var context = $(this);
    $(this).html('<i class="fa fa-spinner" aria-hidden="true"></i>');
    $.ajax({
        type: 'POST',
        url: baseUrl + "/place-order",
        data: "_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            $(this).html(html);
            if (json.status == "success") {
                window.location.replace(json.redirect);
            } else {
                message("error", json.message);
            }
        },
        error: function(data) {}
    });
});*/
$(document).on('click', '.pelocbgqlr', function() {
    var id = $(this).attr("data-id");
    var extra = $(this).attr("data-extra");
    var html = $(this).html();
    $(this).html('<i class="fa fa-spinner" aria-hidden="true"></i>');
    var context = $(this);
    $.ajax({
        type: 'POST',
        url: baseUrl + "/remove-from-cart",
        data: "_token=" + token + "&id=" + id + "&extra=" + extra,
        success: function(data) {
            var json = $.parseJSON(data);
            if(json.status == "success") {
                $(context).html(html);
                $(".doghvwgmxh").html(json.countInCart);
                //$(".bbybqdnnbr").load(location.href + " .bbybqdnnbr");
                //$(".ofspcgaaof").load(location.href + " .ofspcgaaof");
                $(".qnbglempff").load(location.href + " .qnbglempff");
                //$(".liswntfimo").load(location.href + " .liswntfimo");
                $("#bbybqdnnbr").load(" #bbybqdnnbr > *");
                $("#hrlmhsdyog").load(" #hrlmhsdyog > *");
                $("#syqccmpxnz").load(" #syqccmpxnz > *");
                $("#adjhblttnb").load(" #adjhblttnb > *");
                $("#liswntfimo").load(" #liswntfimo > *");
                $(".cswuihbbqs").val("");
                if(json.countInCart < 1){
                    window.location.replace(baseUrl+"/cart");
                }
            }
        },
        error: function(data) {
            var json = $.parseJSON(data);
            swal("error", json.message);
        }
    });
});
$(document).on('click', '.ajksvilzdq', function() {
    var id = $(this).attr("data-orderId");
    var html = $(this).html();
    $(this).html('<i class="fa fa-spinner" aria-hidden="true"></i>');
    var context = $(this);
    $.ajax({
        type: 'POST',
        url: baseUrl + "/pay-order-my-account",
        data: "_token=" + token + "&id=" + id,
        success: function(data) {
            var json = $.parseJSON(data);
            if(json.status == "success") {
                $(context).html(html);
                window.location.replace(baseUrl+"/checkout");
            }
        },
        error: function(data) {
            var json = $.parseJSON(data);
            swal("error", json.message);
        }
    });
});
$(document).on('click', '.fxwspbkikp', function() {
    var id = $(this).attr("data-orderId");
    var html = $(this).html();
    $(this).html('<i class="fa fa-spinner" aria-hidden="true"></i>');
    var context = $(this);
    $.ajax({
        type: 'POST',
        url: baseUrl + "/get-order-products",
        data: "_token=" + token + "&id=" + id,
        success: function(data) {
            $(".kqbxplljnz").html("");
            $("#exampleModal").modal("show");
            $(".kqbxplljnz").html(data);
            $(context).html(html);
        },
        error: function(data) {
            var json = $.parseJSON(data);
            swal("error", json.message);
        }
    });
});
$(document).on('click', '.qghksxwmet', function() {
    var id = $(this).attr("data-id");
    var html = $(this).html();
    $(this).html('<i class="fa fa-spinner" aria-hidden="true"></i>');
    $.ajax({
        type: 'POST',
        url: baseUrl + "/add-to-wishlist",
        data: "id=" + id + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                //swal("success", json.message);
                $(this).html('<img class="img-fluid" src="' + baseUrl + '/frontend/assets/img/icons/heart.png" alt="">');
                $(this).removeClass('qghksxwmet');
                $(this).addClass('kvmbqowqqo');
                $(".zyelivnqoj").html(json.count);
            } else if (json.status == "duplicate") {
                //swal("success", json.message);
                $(this).html(html);
            } else {
                swal("error", json.message);
                $(this).html(html);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.kvmbqowqqo', function() {
    var id = $(this).attr("data-id");
    var html = $(this).html();
    $(this).html('<i class="fa fa-spinner" aria-hidden="true"></i>');
    $.ajax({
        type: 'POST',
        url: baseUrl + "/remove-from-wishlist",
        data: "id=" + id + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                //swal("success", json.message);
                $(this).closest(".kxemfyxryk").remove();
                $(this).html('<img class="img-fluid" src="' + baseUrl + '/frontend/assets/img/icons/wishlist.png" alt="">');
                $(this).removeClass('kvmbqowqqo');
                $(this).addClass('qghksxwmet');
                $(".zyelivnqoj").html(json.count);
                if($('.kxemfyxryk').length == 0){
                    $('.stycxdlxcg').show();
                    $('.stycxdlxcg').append('<center><strong style="color:#000">No products in your wishlist.</strong></center>');
                }
                var i = 1;
                $(".ngpvvgaegx").each(function(){
                    $(this).html(i++);
                });
                message("success", json.message);
            } else {
                swal("error", json.message);
                $(this).html(html);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.fkvcvcpukc', function() {
    var id = $(this).attr("data-id");
    var html = $(this).html();
    $(this).html('<i class="fa fa-spinner" aria-hidden="true"></i>');
    $.ajax({
        type: 'POST',
        url: baseUrl + "/add-to-wishlist",
        data: "id=" + id + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                //swal("success", json.message);
                $(this).html('REMOVE FROM WISHLIST');
                $(this).removeClass('fkvcvcpukc');
                $(this).addClass('nyoyxcahvp');
                $(".zyelivnqoj").html(json.count);
            } else if (json.status == "duplicate") {
                //swal("success", json.message);
                $(this).html(html);
            } else {
                swal("error", json.message);
                $(this).html(html);
            }
        },
        error: function(data) {}
    });
});
$(document).on('click', '.nyoyxcahvp', function() {
    var id = $(this).attr("data-id");
    var html = $(this).html();
    $(this).html('<i class="fa fa-spinner" aria-hidden="true"></i>');
    $.ajax({
        type: 'POST',
        url: baseUrl + "/remove-from-wishlist",
        data: "id=" + id + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                //swal("success", json.message);
                $(this).closest("tr").remove();
                $(this).html('ADD TO WISHLIST');
                $(this).removeClass('nyoyxcahvp');
                $(this).addClass('fkvcvcpukc');
                $(".zyelivnqoj").html(json.count);
                message("success", json.message);
            } else {
                swal("error", json.message);
                $(this).html(html);
            }
        },
        error: function(data) {}
    });
});
$(document).on('blur', '.myhkqenavh', function() {
    var email = $(this).val();
    if(email==""){
        return false;
    }
    $.ajax({
        type: 'POST',
        url: baseUrl + "/check-email-for-duplicacy",
        data: "email=" + email + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                
            } else {
                $(this).val("");
                swal("error", json.message);
            }
        },
        error: function(data) {}
    });
});
$(document).on('blur', '.lnwdkaounu', function() {
    var mobile = $(this).val();
    if(mobile==""){
        return false;
    }
    $.ajax({
        type: 'POST',
        url: baseUrl + "/check-mobile-for-duplicacy",
        data: "mobile=" + mobile + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                
            } else {
                $(this).val("");
                swal("error", json.message);
            }
        },
        error: function(data) {}
    });
});
$(document).on('blur', '.ndgqguccpl', function() {
    var pincode = $(this).val();
    if(pincode==""){
       return false; 
    }
    $.ajax({
        type: 'POST',
        url: baseUrl + "/set-runtime-pincode",
        data: "pincode=" + pincode + "&_token=" + token,
        context: this,
        success: function(data) {
            var json = $.parseJSON(data);
            if (json.status == "success") {
                //$(".hrlmhsdyog").load(location.href + " .hrlmhsdyog");
                $("#bbybqdnnbr").load(" #bbybqdnnbr > *");
                $("#adjhblttnb").load(" #adjhblttnb > *");
            } else {
                $(this).val("");
                swal("error", json.message);
            }
            
        },
        error: function(data) {}
    });
});
var originalPrice = $(".sel-price").html();
$(document).on('click', '.lmizglhoql', function() {
    var extra = $(".mdiczdytgv").val();
    var quantity = $(".vjmusiimhq").val();
    var seo = $(this).attr("data-seo");
    var size = $(this).attr("data-size");
    if(extra=="" || typeof extra === "undefined"){
        extra = "no-extra";
    }
    var url = baseUrl+'/payment/'+seo+'/'+quantity+'/'+extra+'/'+size;
    window.location.href = url;
});
/*$(document).on('click', '.dvorwzbfiq', function() {
    var quantity = $(this).parent().parent().parent().find(".vjmusiimhq").val();
    var seo = $(this).attr("data-seo");
    var size = $(this).attr("data-size");
    var extra = "no-extra";
    var url = baseUrl+'/payment/'+seo+'/'+quantity+'/'+extra+'/'+size;
    window.location.href = url;
});*/
$(document).on('change', '.mdiczdytgv', function() {
    if($(this).val()!=""){
        var price = $(this).find(':selected').data('price');
        $(".sel-price").html(price+".00 INR");
        $(".nprice").hide();
        $(".p-disc").hide();
    }else{
        $(".sel-price").html(originalPrice);
        $(".nprice").show();
        $(".p-disc").show();
    }
});

$(document).on('click', '.swwreigqkm', function() {
    if($(this).find("i").attr("class")=="fa fa-minus"){
        $(this).find("i").removeClass("fa-minus");
        $(this).find("i").addClass("fa-plus");
    }else{
        $(this).find("i").removeClass("fa-plus");
        $(this).find("i").addClass("fa-minus");
    }
});
$(document).on('click', '.zliggxevfz', function() {
    var id = $(this).attr("data-id");
    var heading = $(this).attr("data-heading");
    $(".nsdpujltte").val(id);
    $(".wszhscbqxk").val(heading);
    $("#pp-detail").show();
});
$(document).on('click', '.close', function() {
    $("#pp-detail").hide();
});
$(".moveHere").click(function() {
    $('html, body').animate({
        scrollTop: $("#moveHere").offset().top-50
    }, 200);
});
$(document).mouseup(function(e) 
{
    var container = $("#navbarCollapse");

    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        container.hide();
        
    }
});
var $easyzoom = $('.easyzoom').easyZoom();

		// Setup thumbnails example
		var api1 = $easyzoom.filter('.easyzoom--with-thumbnails').data('easyZoom');

		$('.thumbnails').on('click', 'a', function(e) {
			var $this = $(this);

			e.preventDefault();

			// Use EasyZoom's `swap` method
			api1.swap($this.data('standard'), $this.attr('href'));
		});

		// Setup toggles example
		var api2 = $easyzoom.filter('.easyzoom--with-toggle').data('easyZoom');

		$('.toggle').on('click', function() {
			var $this = $(this);

			if ($this.data("active") === true) {
				$this.text("Switch on").data("active", false);
				api2.teardown();
			} else {
				$this.text("Switch off").data("active", true);
				api2._init();
			}
		});
if ( typeof addressEdit !== 'undefined') {

if($.isNumeric(addressEdit) && addressEdit!=0){
    $(document).ready(function() {
        $('.oirteffste').trigger('click');
        $('.editAddress[data-id="'+addressEdit+'"]').trigger("click");
    });
}else if(addressEdit == "new"){
    $(document).ready(function() {
        $('.oirteffste').trigger('click');
        $('.zerrzjcoex').modal("show");
    });
}

}