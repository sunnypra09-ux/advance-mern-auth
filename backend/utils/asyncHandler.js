const asyncHandler = (reqHandler) => {
  return (req, res, next) => {
    Promise
    .resolve(reqHandler(req, res, next))
    .catch(next);
  };
};

export { asyncHandler };


// const asyncHandler = (fn) => {
//   return async (req, res, next) => {
//     await fn(req, res, next);
//     try {
//     } catch (error) {
//       next(error);
//     }
//   };
// };
