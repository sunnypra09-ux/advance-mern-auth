import { X, Check } from "lucide-react";

export const PasswordCreateria = ({ password }) => {
  const createria = [
    { label: "At least 6 charaters", met: password.length >= 6 },
    { label: "contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "contains a number", met: /[0-9]/.test(password) },
    { label: "contains special charater", met: /[^a-zA-Z0-9]/.test(password) },
  ];
  return (
    <div className="my-3">
      {createria.map((item, idx) => (
        <div
          key={idx}
          className={`flex items-center my-1  gap-5 text-sm ${item.met ? "text-green-500" : "text-gray-400"}`}
        >
          {item.met ? <Check className="size-5" /> : <X className="size-5" />}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export const PasswordStraingthMeter = ({ password }) => {
  const getStraingth = (pass) => {
    let straingth = 0;
    if (pass.length >= 6) straingth++;
    if (/[a-z]/.test(pass)) straingth++;
    if (/[A-Z]/.test(pass)) straingth++;
    if (/[0-9]/.test(pass)) straingth++;
    if (/[^a-zA-Z0-9]/.test(pass)) straingth++;

    return straingth;
  };

  const straingth = getStraingth(password);

  const getColor = (straingth) => {
    if (straingth === 0) return "bg-red-500";
    if (straingth === 1) return "bg-red-400";
    if (straingth === 2) return "bg-yellow-500";
    if (straingth === 3) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getText = (straingth) => {
    if (straingth === 0) return "Very Week";
    if (straingth === 1) return "Week";
    if (straingth === 2) return "Fair";
    if (straingth === 3) return "Good";
    return "Strong";
  };

  return (
    <div>
      <div className="flex items-center justify-between text-sm mt-3 text-gray-400">
        <span>Password strength</span>
        <span>{getText(straingth)}</span>
      </div>
      <div className="flex items-center  gap-0.5 w-full">
        {[...Array(4)].map((item, idx) => {
          return (
            <div
              key={idx}
              className={`w-full h-1 mb-1 rounded-full  ${idx < straingth ? getColor(straingth) : "bg-gray-700"}`}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div>
        <PasswordCreateria password={password} />
      </div>
    </div>
  );
};
export default PasswordStraingthMeter;
