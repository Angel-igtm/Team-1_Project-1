let page = 1;

render();

$('#contacts-form').on('submit', function(e) {
    e.preventDefault();
    let data = $('#contacts-form').serialize();
    $.ajax({
        method: 'post',
        url: "http://localhost:8000/contacts",
        data,
        success: render
    });
    render();

    $('.contacts-front').css('display', 'none');
    $('.contacts-inner').css('display', 'block');
    $('#contacts-form input').val('');
});

function render() {
    $.ajax({
        method: 'get',
        url: `http://localhost:8000/contacts/?_page=${page}&_limit=6`,
        success: function(data) {           
            $('.contacts-list').html('');
            data.forEach(item => {
                $('.contacts-list').append(`
                    <li data-id="${item.id}" class="contact-name">${item.firstName}</li>
                `);
            });
        }
    });
}

$('.prev-btn').on('click', function() {
    if (page === 1) {
        alert('No previous page. This is the first page.');
        return;
    } 
    --page;
    render();
});

$('.next-btn').on('click', function() {
    ++page;
    fetch(`http://localhost:8000/contacts/?_page=${page}&_limit=6`)
        .then(result => result.json())
        .then(data => {
            if (data.length === 0) {
                alert('No next page. This is the last page.');
                page--;
                return;
            } else {
                render();
            }
        })
});

$('.contacts-list').on('click', '.contact-name', function(e) {
    let id = $(e.target).attr('data-id');

    $.ajax({
        method: 'get',
        url: `http://localhost:8000/contacts/${id}`,
        success: function(data) {
            $('.contacts-window').html('').append(`
                <div data-id="${data.id}" class="contacts-popup">
                    <li>First Name: <span class="contact-firstName" data-about="firstName">${data.firstName}</span></li>
                    <li>Last Name: <span class="contact-lastName" data-about="lastName">${data.lastName}</span></li>
                    <li>Phone Number: <span class="contact-phoneNumber" data-about="phoneNumber">${data.phoneNumber}</span></li>
                    <button class="popup-close-btn">x</button>
                    <button class="contact-delete"></button>            
                </div>
            `);
        }
    });

    $('.contacts-window').css('display', 'block');
});

$('.contacts-window').on('click', '.popup-close-btn', function() {
    $('.contacts-window').css('display', 'none');
});

$('.contacts-window').on('click', '.contact-delete', function(e) {
    let id = $(e.target).parent().attr('data-id');
    
    $.ajax({ 
        method: 'delete',
        url: `http://localhost:8000/contacts/${id}`,
        success: () => {
            $('.contacts-window').css('display','none');
            render();
        }
    }) 
});

$('.back_btn-add').on('click',function() {
    $('.contacts-front').css('display', 'block');
    $('.contacts-inner').css('display', 'none');
})

$('.back_list').on('click', function() {
    $('.contacts-front input').val('');
    $('.contacts-inner').css('display', 'block');
    $('.contacts-front').css('display', 'none');
})

$('.contacts-window').on('click', '.contacts-popup span', function(e) {
    let text = $(e.target).text();
    $(e.target).html(`<input type="text" class="edit-item-info" value="${text}">`);
});

$('.contacts-window').on('focusout', '.edit-item-info', function(e) {
    let target = $(e.target);
    let result = target.val();
    let about = target.parent().attr('data-about');
    let id = target.parent().parent().parent().attr('data-id');
    let data = {};
    data[about] = result;

    target.parent().html('').text(result);
    $.ajax({
        method: 'patch',
        url: `http://localhost:8000/contacts/${id}`,
        data,
        success: render
    });

    render();
});

$('.search-btn').on('click', function() {
    let inp = $('.search-block input').val()
    if(inp == ''){
        alert('Input is empty. Please enter the searched name.') 
        return;
    }
    
    $.ajax({
        method: 'get',
        url: `http://localhost:8000/contacts?q=${inp}`,
        success: function(data){
            if(data.length == 0){
                alert('No match for your search is found :(');
                return;
            }
            $('.result-list').css('display','block');
            $('.result').html('');
            data.forEach(item => {
                $('.result').append(`
                    <li >first Name: <span data-about="firstName">${item.firstName}</span></li>
                    <li >Last Name: <span data-about="lastName">${item.lastName}</span></li>
                    <li >phone number: <span data-about="phoneNumber">${item.phoneNumber}</span></li>
                `)
            });
        }
    });
});

$('.has-tooltip').on('mouseover', function() {
    let tooltipText = $(this).attr('data-tooltip');
    let elemPosition = $(this).offset();
    let elemHeight = $(this).css('height').replace('px', '');
    let elemWidth = $(this).css('width').replace('px', '');

    $('body').append(`<div class="tooltip">${tooltipText}</div>`);

    let tooltipWidth = $('.tooltip').css('width').replace('px', '');

    $('.tooltip').css({
        'top': elemPosition.top + 10 + parseInt(elemHeight) + 'px',
        'left': elemPosition.left + parseInt(elemWidth / 2) + 'px',
        'margin-left': `-${parseInt(tooltipWidth) / 2}px`
    });
});

$('.has-tooltip').on('mouseout', function() {
    $('.tooltip').remove();
});