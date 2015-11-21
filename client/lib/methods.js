GetColor = function(state, color) {
    switch (state) {
        case 'selected':
            return 'red';
        case 'moveable':
            return 'green';
        case 'idle':
            switch (color) {
                case -1:
                    return 'transparent';
                case 0:
                    return 'white';
                case 1:
                    return 'black';
            }
    }
    return 'purple';
};

GetBootstrapColor = function(state, color) {
    switch (GetColor(state, color)) {
        case 'red':
            return 'danger';
        case 'green':
            return 'success';
        default:
            return 'default';
    }
}
