package com.motionParts.ecommerce.services;
import com.motionParts.ecommerce.repositories.UserInfoRepository;
import com.motionParts.ecommerce.Models.UserInfo;
import com.motionParts.ecommerce.dto.UserInfoDTO;
//import com.motionParts.ecommerce.Models.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class UserInfoService {

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Transactional
    public UserInfo createUserInfo(UserInfoDTO userInfoDTO) {
        UserInfo userInfo = new UserInfo();
        userInfo.setType(userInfoDTO.getType());
        userInfo.setDocumentType(userInfoDTO.getDocumentType());
        userInfo.setDocumentNumber(userInfoDTO.getDocumentNumber());
        userInfo.setDocumentExp(userInfoDTO.getDocumentExp());
        userInfo.setExpCountry(userInfoDTO.getExpCountry());
        userInfo.setExpRegion(userInfoDTO.getExpRegion());
        userInfo.setExpCity(userInfoDTO.getExpCity());
        userInfo.setFirstName(userInfoDTO.getFirstName());
        userInfo.setMiddleName(userInfoDTO.getMiddleName());
        userInfo.setLastName(userInfoDTO.getLastName());
        userInfo.setSecondLastName(userInfoDTO.getSecondLastName());
        userInfo.setOtherNames(userInfoDTO.getOtherNames());
        userInfo.setLegalName(userInfoDTO.getLegalName());
        userInfo.setEmail(userInfoDTO.getEmail());
        userInfo.setCountry(userInfoDTO.getCountry());
        userInfo.setRegion(userInfoDTO.getRegion());
        userInfo.setCity(userInfoDTO.getCity());
        userInfo.setAddress(userInfoDTO.getAddress());
        userInfo.setAddressDetail(userInfoDTO.getAddressDetail());
        userInfo.setPostalCode(userInfoDTO.getPostalCode());
        userInfo.setPhone(userInfoDTO.getPhone());
        userInfo.setPhone2(userInfoDTO.getPhone2());

        return userInfoRepository.save(userInfo);
    }

    @Transactional
    public UserInfo updateUserInfo(Long id, UserInfoDTO userInfoDTO) {
        UserInfo existingUserInfo = userInfoRepository.findById(id).orElseThrow(() -> new RuntimeException("UserInfo not found"));

        existingUserInfo.setType(userInfoDTO.getType());
        existingUserInfo.setDocumentType(userInfoDTO.getDocumentType());
        existingUserInfo.setDocumentNumber(userInfoDTO.getDocumentNumber());
        existingUserInfo.setDocumentExp(userInfoDTO.getDocumentExp());
        existingUserInfo.setExpCountry(userInfoDTO.getExpCountry());
        existingUserInfo.setExpRegion(userInfoDTO.getExpRegion());
        existingUserInfo.setExpCity(userInfoDTO.getExpCity());
        existingUserInfo.setFirstName(userInfoDTO.getFirstName());
        existingUserInfo.setMiddleName(userInfoDTO.getMiddleName());
        existingUserInfo.setLastName(userInfoDTO.getLastName());
        existingUserInfo.setSecondLastName(userInfoDTO.getSecondLastName());
        existingUserInfo.setOtherNames(userInfoDTO.getOtherNames());
        existingUserInfo.setLegalName(userInfoDTO.getLegalName());
        existingUserInfo.setEmail(userInfoDTO.getEmail());
        existingUserInfo.setCountry(userInfoDTO.getCountry());
        existingUserInfo.setRegion(userInfoDTO.getRegion());
        existingUserInfo.setCity(userInfoDTO.getCity());
        existingUserInfo.setAddress(userInfoDTO.getAddress());
        existingUserInfo.setAddressDetail(userInfoDTO.getAddressDetail());
        existingUserInfo.setPostalCode(userInfoDTO.getPostalCode());
        existingUserInfo.setPhone(userInfoDTO.getPhone());
        existingUserInfo.setPhone2(userInfoDTO.getPhone2());

        return userInfoRepository.save(existingUserInfo);
    }
}
