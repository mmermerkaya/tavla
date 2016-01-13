getColor = function(state, color) {
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
        default:
            return 'purple';
        }
        break;
    default:
        return 'purple';
    }
};

getBootstrapColor = function(state, color) {
    switch (getColor(state, color)) {
    case 'red':
        return 'danger';
    case 'green':
        return 'success';
    default:
        return 'primary';
    }
};
