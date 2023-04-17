use serde::{Deserialize, Serialize};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceCreateDTO {
    pub key: E2EKeyCreateDTO,
    pub name: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceDTO {
    pub key: E2EKeyDTO,
    pub name: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyVariantCreateDTO {
    #[serde(with = "base64")]
    pub activator: Vec<u8>,
    #[serde(with = "base64")]
    pub activator_nonce: Vec<u8>,
    #[serde(with = "base64")]
    pub value: Vec<u8>,
    #[serde(with = "base64")]
    pub value_nonce: Vec<u8>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyCreateDTO {
    pub keys: Vec<E2EKeyVariantCreateDTO>,
    #[serde(with = "base64")]
    pub activator: Vec<u8>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyVariantDTO {
    #[serde(with = "base64")]
    pub activator: Vec<u8>,
    #[serde(with = "base64")]
    pub activator_nonce: Vec<u8>,
    #[serde(with = "base64")]
    pub value: Vec<u8>,
    #[serde(with = "base64")]
    pub value_nonce: Vec<u8>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyDTO {
    pub keys: Vec<E2EKeyVariantDTO>,
    #[serde(with = "base64")]
    pub activator: Vec<u8>,
}

mod base64 {
    use serde::{Deserialize, Serialize};
    use serde::{Deserializer, Serializer};

    pub fn serialize<S: Serializer>(v: &Vec<u8>, s: S) -> Result<S::Ok, S::Error> {
        let base64 = base64::encode(v);
        String::serialize(&base64, s)
    }

    pub fn deserialize<'de, D: Deserializer<'de>>(d: D) -> Result<Vec<u8>, D::Error> {
        let base64 = String::deserialize(d)?;
        base64::decode(base64.as_bytes()).map_err(|e| serde::de::Error::custom(e))
    }
}
