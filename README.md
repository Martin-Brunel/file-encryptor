# A simple End-to-End Encryption integration with Lagertha API

## The Project

The objective of this project is to create an application that allows users to generate encrypted files with a .lf format and download them securely to their local machine. This ensures that the files remain secure and can only be decrypted by the intended recipient. 
The goal is to demonstrate that end-to-end encryption can be easily integrated into applications, significantly enhancing overall security. 
Every developer should consider this approach to improve the security of their applications.

## Use Cases
- Create a User Account: Users can create their accounts securely.
- User Authentication: Users can log in with secure authentication.
- Encrypt a File: Users can encrypt files to make them invulnerable during transfer.
- Decrypt a File: Users can decrypt files, ensuring only authorized users have access.

# Technological Choices
- Next.js: Chosen for its powerful front-end capabilities and the option to extend to server-side actions if necessary.

## Set Up Environment Variables

Create a .env.local file in the root of your project to store your API key and other sensitive information.

```
NEXT_PUBLIC_LAGERTHA_URL=https://api-lagertha.exemple.com
NEXT_PUBLIC_LAGERTHA_APPLICATION_ID=12
```

Note: This requires having deployed a Lagertha API. You can find the deployment documentation at the following

[Lagertha API Documentation](https://doc.lagertha.tech/en)


## Conclusion

This project is intentionally simplistic as it serves as a proof of concept (POC) to demonstrate the ease and effectiveness of using the Lagertha API for secure file encryption and decryption. Despite its simplicity, this POC can serve as a foundational base for any developer looking to implement robust security measures in their applications.

## Additional Resources

- **Lagertha API Documentation**:[Lagertha API Documentation](https://doc.lagertha.tech/en)
- **Medium article**: [a simple end to end encryption integration with Lagertha API](https://medium.com/@martin_42533/a-simple-end-to-end-encryption-integration-with-lagertha-api-669e3bebd905)