import React, { useState, useEffect } from "react";
import { Button, Input, Checkbox } from "digitinary-ui";
import { User, Mail, Lock, Phone, Calendar, Globe } from "lucide-react";

type CountryOption = {
  label: string;
  value: string;
};

interface FormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  age: string;
  agreeToTerms: boolean;
  country: string;
}

type ValidateFieldType = {
  [K in keyof FormData]: (value: FormData[K]) => string;
};

const Form: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    agreeToTerms: false,
    country: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const countryOptions: CountryOption[] = [
    { label: "United States", value: "usa" },
    { label: "United Kingdom", value: "uk" },
    { label: "Canada", value: "canada" },
    { label: "Australia", value: "australia" },
    { label: "Germany", value: "germany" },
  ];

  const validateField: ValidateFieldType = {
    fullName: (value: string): string => {
      if (!value) return "Full name is required";
      if (value.length < 3) return "Full name must be at least 3 characters";
      return "";
    },
    email: (value: string): string => {
      if (!value) return "Email is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Please enter a valid email address";
      if (!value.endsWith(".com") && !value.endsWith(".net")) {
        return "Email must end with .com or .net";
      }
      return "";
    },
    password: (value: string): string => {
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      if (!/\d/.test(value)) return "Password must include at least one number";
      if (!/[!@#$%^&*]/.test(value))
        return "Password must include at least one special character";
      return "";
    },
    phone: (value: string): string => {
      if (!value) return "Phone number is required";
      if (!/^\d+$/.test(value)) return "Please enter numbers only";
      if (value.length !== 10)
        return "Please enter a valid 10-digit phone number";
      return "";
    },
    age: (value: string): string => {
      if (!value) return "Age is required";
      const age = parseInt(value);
      if (isNaN(age) || age < 18 || age > 65)
        return "Age must be between 18 and 65";
      return "";
    },
    country: (value: string): string => {
      if (!value) return "Please select a country";
      return "";
    },
    agreeToTerms: (value: boolean): string => {
      if (!value) return "You must agree to the terms";
      return "";
    },
  };

  const handleInputChange = <T extends keyof FormData>(
    value: string | number | boolean,
    fieldName: T
  ) => {
    let processedValue: FormData[T];

    // Convert number to string if necessary
    if (typeof value === "number") {
      processedValue = value.toString() as FormData[T];
    } else if (typeof value === "boolean") {
      processedValue = value as FormData[T];
    } else {
      processedValue = value as FormData[T];
    }

    // Special handling for phone field
    if (fieldName === "phone" && typeof processedValue === "string") {
      processedValue = processedValue.replace(/\D/g, "") as FormData[T];
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: processedValue,
    }));

    const error = validateField[fieldName](processedValue);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCountry(value);
    handleInputChange(value, "country");
  };

  const handleCheckboxChange = () => {
    const newValue = !formData.agreeToTerms;
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: newValue,
    }));
    setErrors((prev) => ({
      ...prev,
      agreeToTerms: newValue ? "" : "You must agree to the terms",
    }));
  };

  useEffect(() => {
    let valid = true;

    Object.keys(formData).forEach((field) => {
      const value = formData[field as keyof FormData];
      if (validateField[field as keyof typeof validateField]) {
        const error = validateField[field as keyof typeof validateField](
          value as never
        );
        if (error) valid = false;
      }
    });

    const countryError = validateField.country(selectedCountry);
    if (countryError) valid = false;

    setIsFormValid(valid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, selectedCountry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const submissionData = {
        ...formData,
        country: selectedCountry,
      };
      console.log("Form submitted:", submissionData);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-12 bg-green-50 rounded-lg">
        <h2 className="text-2xl font-bold text-green-600 mb-2">Success!</h2>
        <p className="text-green-600">Form submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-6 bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Registration Form
          </h2>
          <p className="mt-2 text-gray-600">
            Please fill in your details below
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(value) => handleInputChange(value, "fullName")}
              errorMsg={errors.fullName}
              helperText="Enter at least 3 characters"
              placeholder="Enter your full name"
              type="text"
              size="medium"
              clearable
              className="pl-10"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
            <Input
              label="Email Address"
              value={formData.email}
              onChange={(value) => handleInputChange(value, "email")}
              errorMsg={errors.email}
              helperText="example@email.com"
              placeholder="Enter your email"
              type="email"
              size="medium"
              clearable
              className="pl-10"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
            <Input
              label="Password"
              value={formData.password}
              onChange={(value) => handleInputChange(value, "password")}
              errorMsg={errors.password}
              helperText="Minimum 8 characters, 1 number, 1 special character"
              placeholder="Enter your password"
              type="password"
              size="medium"
              clearable
              className="pl-10"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(value) => handleInputChange(value, "phone")}
              errorMsg={errors.phone}
              helperText="Enter 10 digits only"
              placeholder="Enter your phone number"
              type="text"
              size="medium"
              clearable
              className="pl-10"
            />
          </div>

          {/* Age */}
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
            <Input
              label="Age"
              value={formData.age}
              onChange={(value) => handleInputChange(value.toString(), "age")}
              errorMsg={errors.age}
              helperText="Must be between 18 and 65"
              placeholder="Enter your age"
              type="number"
              size="medium"
              clearable
              className="pl-10"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={selectedCountry}
                onChange={handleCountryChange}
              >
                <option value="">Select your country</option>
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-500">{errors.country}</p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <Checkbox
              label="I agree to the terms and conditions"
              labelPlacement="start"
              checked={formData.agreeToTerms}
              handleCheckboxChange={handleCheckboxChange}
              size="medium"
              disabled={false}
              id="terms-checkbox"
              dataId="terms-checkbox"
            />
            {errors.agreeToTerms && (
              <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            type="submit"
            disabled={!isFormValid}
            className="w-full"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Form;
