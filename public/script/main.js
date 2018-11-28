function Nav() {
    if ($('.header').hasClass('active')) {
        $('.header').removeClass('active');
        $('.header-button').removeClass('active');
    } else {
        $('.header').addClass('active');
        $('.header-button').addClass('active');
    }
}

function Navs(index) {
    $('.nav ul li').eq(index).find('a').addClass('active');
}

function formNext() {
    if ($('#form-name').val() == '') {
        alert("请输入姓名");
        return true;
    } else if ($('#form-add').val() == '') {
        alert("请输入所在地");
        return true;
    } else if ($('#form-company').val() == '') {
        alert("请输入所属公司");
        return true;
    } else if ($('#form-email').val() == '') {
        alert("请输入邮箱");
        return true;
    } else {
        $('.form-page1').hide();
        $('.form-page2').show();
    }
}

var countdown = 60;

function settime() {
    if (countdown == 0) {
        $('.yzm .first').show();
        countdown = 60;
    } else {
        $('.yzm .first').hide();
        $('.yzm .djs').html("重新发送(" + countdown + ")");
        countdown--;
    }
    setTimeout(function() {
        settime()
    }, 1000)
}

var phoneCode = '';
var re = /^1\d{10}$/;

function yzm() {
    if (!$('#form-phone').val() == '') {
        settime();
        $.post('/Sms', {
                phone: $('#form-phone').val(),
                area: $('#form-areas').attr('data-text')
            },
            function(data, status) {
                if (data.code == '0') {
                    phoneCode = data.data;
                }
                if (data.code == '1009') {
                    alert(data.data);
                }
            });
    } else {
        alert("手机格式不正确！");
        return;
    }
}

function FormPost() {

    if ($('#form-name').val() == '') {
        alert("请输入姓名");
        return true;
    } else if ($('#form-add').val() == '') {
        alert("请输入所在地");
        return true;
    } else if ($('#form-company').val() == '') {
        alert("请输入所属公司");
        return true;
    } else if ($('#form-email').val() == '') {
        alert("请输入邮箱");
        return true;
    } else if ($('#form-phone').val() == '') {
        alert("手机格式不正确！");
        return true;
    } else if (Number($('#form-code').val()) != Number(phoneCode)) {
        alert("验证码不正确");
        return true;
    } else if ($('#form-types').attr('data-text') == '') {
        alert("请选择类型");
        return true;
    } else if ($('#form-styles').attr('data-text') == '') {
        alert("请选择风格");
        return true;
    } else {
        $.post('/FormPost', {
                name: $('#form-name').val(),
                add: $('#form-add').val(),
                company: $('#form-company').val(),
                email: $('#form-email').val(),
                phone: $('#form-phone').val(),
                type: $('#form-types').attr('data-text'),
                style: $('#form-styles').attr('data-text'),
                area: $('#form-areas').attr('data-text')
            },
            function(data, status) {
                if (data.code == '0') {
                    alert('提交成功!我们会在7个工作日内联系您！');
                    FormClose();
                }
            });
    }
}

function ToForm() {
    $('.header').removeClass('active');
    $('.header-button').removeClass('active');
    if (document.body.clientWidth < '801') {
        $('body').addClass('body-fixed');
    }
    $('.form-mask').show();
    $('.form-box').animate({
        top: 0
    });
}

function FormClose() {
    $('.form-mask').hide();
    $('.form-box').animate({
        top: '-250%'
    });
    $('body').removeClass('body-fixed');
    $('.form-page2').hide();
    $('.form-page1').show();
    $('#form-name').val('');
    $('#form-add').val('');
    $('#form-company').val('');
    $('#form-email').val('');
    $('#form-phone').val('');
    $('#form-types').attr('data-text', '');
    $('#form-styles').attr('data-text', '');
    $('#form-types').html('类型/TYPE');
    $('#form-styles').html('风格/STYLE');
}

$(window).load(function() {

    $(".header,.form-mask,.body-fixed").on("touchmove", function(event) {
        event.preventDefault;
    }, false);

    $('.designer-card .cards').on('touchend', function() {
        $('.designer-card .cards').removeClass('active');
        $(this).addClass('active');
    });

    $('.designer-box').on('touchmove', function(event) {
        $('.designer-card .cards').removeClass('active');
    });

    $('.form-radio').on('click', function() {
        $(this).next('.form-li-radio').slideToggle()
    })

    $('.form-li-radio label').on('click', function() {
        var text = $(this).prev().val();
        var text2 = $(this).html();
        $(this).parent('.form-li-radio').prev('.form-radio').find('span').html(text);
        $(this).parent('.form-li-radio').prev('.form-radio').find('span').attr('data-text', text)
        $(this).parent('.form-li-radio').slideUp();

        var span = $(this).parent('.form-li-radio').prev('.form-radio').find('span')
        if (span.attr('id') == 'form-areas') {
            $(this).parent('.form-li-radio').prev('.form-radio').find('span').html(text2)
        }
    })

    var lists = $('.list-right ul li').length;
    for (var i = 0; i < lists; i++) {
        $('.list-right ul li').eq(i).delay(i * 200).animate({
            marginLeft: "0px"
        })
    }
    $('input, textarea').placeholder();
})