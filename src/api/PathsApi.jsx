const apiUrl = "https://backend-forenseek.onrender.com/api";

export const CasesGET = `${apiUrl}/case`;

export const CasePOST = `${apiUrl}/case`;

export const CasesDetailsGET = `${apiUrl}/case`;

export const CaseUpdatePUT = `${apiUrl}/case`;

export const UserPOST = `${apiUrl}/user`;

export const UserLoginPOST = `${apiUrl}/user`;

export const UserByIdGET = `${apiUrl}/user`;

export const EvidencesGET = `${apiUrl}/evidence`;

export const EvidenceDetailsGET = `${apiUrl}/evidence`;

export const EvidencePUT = `${apiUrl}/evidence`;

export const EvidencePOST = `${apiUrl}/evidence`;

export const LoginPOST = `${apiUrl}/login`;

export const UserPUT = `${apiUrl}/user`;

export const LaudoPOST = `${apiUrl}/laudo`;

export const LaudoGET = `${apiUrl}/laudo`;

export const LaudoByEvidenciaGET = `${apiUrl}/laudo/by-evidencia`;

export const ReportGET = `${apiUrl}/report`;

export const ReportPOST = `${apiUrl}/report`;

export const PacientsGET = `${apiUrl}/pacient`

export const HeaderReq = (token) => {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};
