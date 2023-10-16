module.exports.post = function (req, res) {
  if (
    !req.body ||
    !req.body.submission ||
    !req.body.submission.First_Name ||
    !req.body.submission.Last_Name
  ) {
    return res.setStatusCode(400).setPayload({
      message:
        "Error, you did not enter any data into First Name or Last Name. Please enter data here.",
    });
  }

  const fullName =
    req.body.submission.First_Name + " " + req.body.submission.Last_Name;

  return res.setStatusCode(200).setPayload({
    Full_Name: fullName,
  });
};
