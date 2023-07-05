// Helper functions to be used throughtout the project scope
module.exports = {
    // Function to select the appropriate option in a dropdown menu
    selectOption: function (status, options) {
        return options.fn(this).replace(new RegExp('value=\"' + status + '\"'), '$&selected="selected"');
    },

    // Function to check for file
    isEmpty: function (obj) {
        if (typeof obj !== 'object' || obj === null) {
            return true;
        }
      
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
      
        return true;
    },

    // Function to check if the user is Authenticated
    isUserAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        }
        
        else {
            req.flash('error_message', 'You must be logged in to view this page');
            res.redirect('/login');
        }
        
    }
};