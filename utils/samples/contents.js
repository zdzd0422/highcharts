/* global $, window */

/**
 * Checks if a string is a valid jQuery selector.
 * @param  {string} selector - the jQuery selector to check
 * @returns {Boolean}          true if the selector is valid;
 *                             false if not
 */
function isValidSelector(selector) {
    if (typeof selector !== 'string') {
        return false;
    }
    try {
        $(selector);
    } catch (error) {
        return false;
    }
    return true;
}

/**
 * Returns a safe jQuery selector.
 * @param  {object} selector - a jQuery selector candidate
 * @returns {string}         a safe jQuery selector
 */
function getSafeSelector(selector) {
    if (!isValidSelector(selector)) {
        selector = '';
    }
    return selector;
}

$(function () {
    var parent = window.parent,
        view = parent.frames[1],
        $sample = $(getSafeSelector(parent.location.hash));

    $('a.sample-link').click(function (e) {
        e.preventDefault();
        parent.location.hash = this.id;
        view.location.href = this.href;
    });

    // If the URL of the parent window had a hash (#) with an ID of a specific
    // sample, load it
    if ($sample.length) {
        // Load sample contents
        $sample.click();

        // Scroll sample list to sample
        $('html, body').animate({
            scrollTop: $sample.offset().top - 300
        }, 500);

        $sample.parent().addClass('hilighted');
    }

    parent.onhashChange = function (e) {
        e.preventDefault();
    };
});
