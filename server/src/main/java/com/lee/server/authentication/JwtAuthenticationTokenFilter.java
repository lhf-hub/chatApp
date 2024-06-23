package com.lee.server.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Objects;

@Component
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {

    private static final String TokenSecret = "lhf20040208";
    private DecodedJWT parseToken(String token) {
        DecodedJWT jwt = JWT.require(Algorithm.HMAC256(TokenSecret)).build().verify(token);
        jwt.getClaims();
        return jwt;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //获取token
        String token = request.getHeader("token");

        if (!StringUtils.hasText(token)) {
            //放行
//            System.out.println("放行你");
            filterChain.doFilter(request, response);
            return;
        }
        //解析token
        String id;
        String password;
        try {
            DecodedJWT claims = parseToken(token);
            id = claims.getClaim("id").asString();
            password = claims.getClaim("password").asString();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("非法token");
            return;
        }

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(id,password);
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        //放行
        filterChain.doFilter(request, response);
    }
}


