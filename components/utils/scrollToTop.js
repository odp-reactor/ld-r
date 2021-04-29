/**
 * Scroll to top of the page
 */
export function scrollToTop() {
    let body = $('html, body');
    body.stop().animate({ scrollTop: 0 }, '500', 'swing', function() {});
}
