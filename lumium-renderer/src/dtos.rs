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

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PageDTO {
    pub id: String,
    #[serde(with = "crypt")]
    pub name: Vec<u8>,
    #[serde(with = "crypt")]
    pub content: Vec<u8>,
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

mod crypt {
    use ring::aead::NONCE_LEN;
    use serde::{Deserialize, Serialize};
    use serde::{Deserializer, Serializer};

    use crate::crypto::{decrypt, encrypt, generate_random_nonce};

    pub fn serialize<S: Serializer>(v: &Vec<u8>, s: S) -> Result<S::Ok, S::Error> {
        let nonce = generate_random_nonce();
        let encrypt = base64::encode(encrypt(nonce, v.to_vec()).unwrap());
        let nonce = base64::encode(nonce);
        String::serialize(&format!("{}.{}", &nonce, &encrypt), s)
    }

    pub fn deserialize<'de, D: Deserializer<'de>>(d: D) -> Result<Vec<u8>, D::Error> {
        let base64 = String::deserialize(d)?;
        let parts = base64.split(".");
        let parts: Vec<Vec<u8>> = parts
            .map(|p| base64::decode(p.as_bytes()).unwrap())
            .collect();
        if parts.len() != 2 {
            return Err(serde::de::Error::custom("failed to parse nonce"));
        }
        let nonce: [u8; NONCE_LEN] = parts.get(0).unwrap().clone().try_into().unwrap();
        let data = parts.get(1).unwrap().to_vec();
        Ok(decrypt(nonce, data).unwrap())
    }
}
