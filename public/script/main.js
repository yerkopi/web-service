/**
 * Timer
 */
let timerInterval
Swal.fire({
    title: 'hold on',
    html: 'a sec...',
    timer: 1000,
    timerProgressBar: true,
    didOpen: () => {
        Swal.showLoading()
    },
    willClose: () => {
        clearInterval(timerInterval)
    }
})

$(document).ready(function() {
    /**
     * fetch footer and place to $('#footer')
     */
    $.ajax({
        url: '/components/footer',
        type: 'GET',
        success: function(data) {
            $('#footer').append(data)
        }
    })

    /**
     * fetch header and place to $('#header')
     */
    $.ajax({
        url: '/components/header',
        type: 'GET',
        success: function(data) {
            $('#header').append(data)
        }
    })
})
