package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.specification.TaskSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<TaskResponse> getTasks(String userEmail, TaskStatus status, String search) {
        User user = getUser(userEmail);
        return taskRepository.findAll(TaskSpecification.withFilters(user.getId(), status, search))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse createTask(String userEmail, TaskRequest request) {
        User user = getUser(userEmail);

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .user(user)
                .build();

        return toResponse(taskRepository.save(task));
    }

    public TaskResponse updateTask(String userEmail, Long taskId, TaskRequest request) {
        Task task = getOwnedTask(userEmail, taskId);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        return toResponse(taskRepository.save(task));
    }

    public void deleteTask(String userEmail, Long taskId) {
        Task task = getOwnedTask(userEmail, taskId);
        taskRepository.delete(task);
    }

    private Task getOwnedTask(String userEmail, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Tâche introuvable avec l'id : " + taskId));

        if (!task.getUser().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("Vous n'avez pas accès à cette tâche");
        }
        return task;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + email));
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
