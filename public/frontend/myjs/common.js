function toast(type, heading, message) {
    $.toast({
        heading: heading,
        position: 'bottom-right',
        loaderBg: '#ff6849',
        text: message,
        showHideTransition: 'slide',
        icon: type.toLowerCase(),
        hideAfter: 5500,
    })
}

$('.txtOnly').on('keypress', function(event) {
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});
$(".txtOnly").keypress(function(e) {
    var key = e.keyCode;
    if (key >= 48 && key <= 57) {
        e.preventDefault();
    }
});

$(document).on('keypress keyup blur', '.txtOnly', function(e) {
    var key = e.keyCode;
    if (key >= 48 && key <= 57) {
        e.preventDefault();
    }
});
$(document).on('keypress keyup blur', '.is_natural', function() {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
    if ($(this).val().length > 9) {
        $(this).css("border-bottom", "2px solid #9f9f9f");
        return false;
    }
});
$(document).on('blur', '.is_natural', function() {
    if($(this).val() !=""){
        if ($(this).val().length < 10) {
            $(this).val("");
            //swal("error", "Invalid mobile number");
            $(".iisfoxbavx").show();
            return false;
        }else{
            $(".iisfoxbavx").hide();
        }
    }
});
$(document).on('keypress keyup blur', '.isMobile', function() {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
    if ($(this).val().length > 9) {
        $(this).css("border-bottom", "2px solid #9f9f9f");
        return false;
    }
});
$(document).on('blur', '.isMobile', function() {
    if($(this).val() !=""){
        if ($(this).val().length < 10) {
            $(this).val("");
            //swal("error", "Invalid mobile number");
            $(".iisfoxbavx").show();
            return false;
        }else{
            $(".iisfoxbavx").hide();
        }
    }
});
$(document).on('blur', '.isEmail', function() {
    if($.trim($(this).val())!=""){
        if(!isEmail($(this).val())){
            //swal("error", "Email address is not valid.");
            //$(".xquxbyqyaf").show();
            $(".yeyzwhiuyo").show();
            $(".isEmail").val("");
        }else{
            $(".yeyzwhiuyo").hide();
        }
    }
});
$(document).on('keypress keyup blur', '.is_pincode', function() {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
    if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
    if ($(this).val().length > 5) {
        $(this).css("border-bottom", "2px solid #9f9f9f");
        return false;
    }
});
$(document).on('blur', '.is_pincode', function() {
    if($(this).val() !=""){
        if ($(this).val().length < 6) {
            $(this).val("");
            //swal("error", "Invalid pincode");
            $(".xquxbyqyaf").show();
            return false;
        }else{
            $(".xquxbyqyaf").hide();
        }
    }
});
function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}