package com.polisual.repository;

import com.polisual.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByAtivoTrueOrderByOrdemAscIdAsc();
    List<Banner> findAllByOrderByOrdemAscIdAsc();
}
