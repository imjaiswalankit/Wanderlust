// function wrapAsync(fn) {
//     return (req, res, next) => {
//         fn(req, res, next).catch(next);
//     };
// }
// buut iisko niche wale ki tarh likhte sp that sidha export kar ske
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};