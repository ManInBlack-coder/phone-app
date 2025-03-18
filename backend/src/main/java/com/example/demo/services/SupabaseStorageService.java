package com.example.demo.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${supabase.storage.url}")
    private String storageUrl;

    @Value("${supabase.storage.bucket}")
    private String bucketName;

    @Value("${supabase.key}")
    private String supabaseKey;

    private final HttpClient httpClient = HttpClient.newBuilder().build();

  
    public String uploadFile(MultipartFile file) throws IOException {
        try {
            // Generate a unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;
            
            // Creates the URL for the upload
            String uploadUrl = String.format("%s/object/%s/%s", storageUrl, bucketName, filename);
            
            // Creates the request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uploadUrl))
                    .header("Authorization", "Bearer " + supabaseKey)
                    .header("Content-Type", file.getContentType())
                    .PUT(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                    .build();
            
            // Sends the request
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            // Checks if the upload was successful
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                // Return the public URL of the file
                // Supabase public URL format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[filename]
                return String.format("https://isgqnyhkexduycwmcjxa.supabase.co/storage/v1/object/public/%s/%s", bucketName, filename);
            } else {
                throw new IOException("Failed to upload file to Supabase: " + response.body());
            }
        } catch (Exception e) {
            throw new IOException("Error uploading file to Supabase: " + e.getMessage(), e);
        }
    }

    /**
     * Deletes a file from Supabase Storage
     */
    public void deleteFile(String fileUrl) throws IOException {
        try {
            // Extracts the filename from the URL
            String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            
            // Creates the URL for the delete
            String deleteUrl = String.format("%s/object/%s/%s", storageUrl, bucketName, filename);
            
            // Creates the request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(deleteUrl))
                    .header("Authorization", "Bearer " + supabaseKey)
                    .DELETE()
                    .build();
            
            // Sends the request
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            // Checks if the delete was successful
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IOException("Failed to delete file from Supabase: " + response.body());
            }
        } catch (Exception e) {
            throw new IOException("Error deleting file from Supabase: " + e.getMessage(), e);
        }
    }
} 