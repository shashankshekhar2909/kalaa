import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Certifications } from "./Certifications";

describe("Certifications", () => {
  it("renders certification name, issuer, time elements and credential badge", () => {
    const { container } = render(
      <Certifications
        items={[
          {
            name: "Certified Kubernetes Security Specialist (CKS)",
            issuer: "CNCF",
            date: "2024-02",
            expiryDate: "2027-02",
            credentialId: "CNCF-CKS-884120",
          },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Certifications" })).toBeInTheDocument();
    expect(screen.getByText("Certified Kubernetes Security Specialist (CKS)")).toBeInTheDocument();
    expect(screen.getByText("CNCF-CKS-884120")).toBeInTheDocument();
    expect(container.querySelectorAll("time")).toHaveLength(2);
  });
});
