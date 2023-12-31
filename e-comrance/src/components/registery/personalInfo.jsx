import { Input, Tag, Form } from "antd";
import React, { useState } from "react";

const customizeRequiredMark = (label, { required }) => (
  <>
    {required ? (
      <Tag color="error">Required</Tag>
    ) : (
      <Tag color="warning">optional</Tag>
    )}
    {label}
  </>
);

const PersonalInfo = ({
  firstName,
  setFirstName,
  lastName,
  setLastname,
  email,
  setEmail,
}) => {
  const [form] = Form.useForm();

  const [requiredMark, setRequiredMarkType] = useState("optional");

  const onRequiredTypeChange = ({ requiredMarkValue }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  return (
    <Form
      style={{ padding: "30px" }}
      form={form}
      layout="vertical"
      initialValues={{
        requiredMarkValue: true,
      }}
      onValuesChange={onRequiredTypeChange}
      requiredMark={
        requiredMark === "customize" ? customizeRequiredMark : requiredMark
      }
    >
      <Form.Item label="First name" required>
        <Input
          id="personalInfoInput"
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </Form.Item>
      <Form.Item label="Last name" required>
        <Input
          id="personalInfoInput"
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
      </Form.Item>
      <Form.Item label="Email" required>
        <Input
          id="personalLongInput"
          type="text"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Item>
    </Form>
  );
};

export default PersonalInfo;
