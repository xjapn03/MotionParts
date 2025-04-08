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
}
