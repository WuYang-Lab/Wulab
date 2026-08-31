<template>
  <div class="people-wrapper">
    <div class="people-shell">
      <!-- ✅ People 放在左侧导航栏上方，左对齐 -->
      <h1 class="page-title">People</h1>

      <div class="people-container">
        <!-- 左侧导航 -->
        <div class="year-sidebar">
          <div
            v-for="s in sections"
            :key="s.key"
            class="year-link"
            :class="{ active: activeSection === s.key }"
            @click="scrollToSection(s.key)"
          >
            {{ s.label }}
          </div>
        </div>

        <!-- 右侧正文底板 -->
        <div class="people-content-board">

          <!-- ===== PI ===== -->
          <section id="sec-pi" class="section-block" data-key="pi" ref="sectionBlocks">
            <div class="section-head">
              <div class="section-badge">Principal Investigator</div>
            </div>

            <div class="people-grid one">
              <div class="person-card pi-card">
                <div class="person-main">
                  <div class="person-top">
                    <div class="name">{{ pi.name }}</div>
                  </div>

                  <!-- ✅ PI：名字下方介绍 -->
                  <p class="pi-intro" v-if="pi.intro">
                    {{ pi.intro }}
                  </p>

                  <!-- ✅ PI：邮箱/地址在介绍下面 -->
                  <div class="pi-info">
                    <div class="contact-row" v-if="pi.email">
                      <span class="contact-icon" aria-hidden="true">
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none">
                          <path d="M4 6h16v12H4V6Z" />
                          <path d="M4 7l8 6 8-6" />
                        </svg>
                      </span>
                      <a class="email-link contact-text" :href="mailto(pi.email)">{{ pi.email }}</a>
                    </div>

                    <div class="contact-row" v-if="pi.office">
                      <span class="contact-icon" aria-hidden="true">
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none">
                          <path d="M12 21s7-5 7-11a7 7 0 1 0-14 0c0 6 7 11 7 11Z" />
                          <path d="M12 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                        </svg>
                      </span>
                      <span class="contact-text">{{ pi.office }}</span>
                    </div>
                  </div>

                  <!-- ✅ PI：Profile/Publications 在邮箱/地址下面 -->
                  <div class="actions">
                    <a class="btn" :href="pi.profileLink" target="_blank" rel="noopener noreferrer">WCHSCU</a>
                    <a class="btn ghost" :href="pi.publicationsLink" target="_blank" rel="noopener noreferrer">Google Scholar</a>
                    <a class="btn" :href="pi.researchgateLink" target="_blank" rel="noopener noreferrer">ResearchGate</a>
                  </div>
                </div>

                <!-- 右侧二寸照 (添加了点击放大功能) -->
                <div 
                  class="pi-photo zoomable" 
                  :class="{ disabled: !pi.photo }"
                  @click="pi.photo && openImage(pi.photo, pi.name)"
                  aria-hidden="true"
                >
                  <img
                    v-if="pi.photo"
                    :src="pi.photo"
                    :alt="pi.name"
                    class="pi-photo-img"
                    loading="lazy"
                  />
                  <svg v-else class="pi-fallback" viewBox="0 0 24 24" fill="none">
                    <path class="s" d="M12 12a4.3 4.3 0 1 0 0-8.6A4.3 4.3 0 0 0 12 12Z" />
                    <path class="s" d="M4.5 20.2c1.7-4 13.3-4 15 0" />
                    <path class="b" d="M9.3 9.2h5.4" />
                  </svg>
                  
                  <!-- 放大提示图标 -->
                  <span v-if="pi.photo" class="zoom-hint" aria-hidden="true">+</span>
                </div>
              </div>
            </div>
          </section>

          <!-- ===== Postdoc ===== -->
          <section id="sec-postdoc" class="section-block" data-key="postdoc" ref="sectionBlocks">
            <div class="section-head">
              <div class="section-badge">Postdoctoral Fellow</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in postdocs"
                :key="'postdoc-' + p.name"
                :class="{ open: openCardKey === cardKey('postdoc', p) }"
              >
                <div class="member-photo" aria-hidden="true">
                  <div
                    class="photo-oval zoomable"
                    :class="{ disabled: !p.photo }"
                    @click="p.photo && openImage(p.photo, p.name)"
                  >
                    <img
                      v-if="p.photo"
                      :src="p.photo"
                      :alt="p.name"
                      class="member-photo-img"
                      loading="lazy"
                    />
                    <svg v-else class="member-fallback" viewBox="0 0 24 24" fill="none">
                      <path class="s" d="M12 12a4.3 4.3 0 1 0 0-8.6A4.3 4.3 0 0 0 12 12Z" />
                      <path class="s" d="M4.5 20.2c1.7-4 13.3-4 15 0" />
                      <path class="b" d="M9.6 9.3h4.8" />
                    </svg>

                    <span v-if="p.photo" class="zoom-hint" aria-hidden="true">+</span>
                  </div>
                </div>

                <div class="member-body">
                  <!-- name/role 居中 -->
                  <div class="member-name">{{ p.name }}</div>
                  <div class="member-role">{{ p.role }}</div>

                  <!-- ✅ 邮箱图标 + 邮箱（整体居左） -->
                  <div class="member-lines" v-if="p.email">
                    <div class="contact-row">
                      <span class="contact-icon" aria-hidden="true">
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none">
                          <path d="M4 6h16v12H4V6Z" />
                          <path d="M4 7l8 6 8-6" />
                        </svg>
                      </span>
                      <a class="email-link contact-text" :href="mailto(p.email)">{{ p.email }}</a>
                    </div>
                  </div>

                  <!-- ✅ 每个 tag 都有底板（单独 chip），自动换行 -->
                  <div class="member-tags" v-if="p.tags && p.tags.length">
                    <span class="tag-chip" v-for="t in p.tags" :key="t">{{ t }}</span>
                  </div>

                  <!-- details：研究方向 + 兴趣爱好 -->
                  <div class="details-panel" v-if="openCardKey === cardKey('postdoc', p)">
                    <div class="detail-item" v-if="p.interest">
                      <span class="detail-label">Direction</span>
                      <span class="detail-text">{{ p.interest }}</span>
                    </div>
                    <div class="detail-item" v-if="p.hobby">
                      <span class="detail-label">Hobby</span>
                      <span class="detail-text">{{ p.hobby }}</span>
                    </div>
                  </div>

                  <button class="btn ghost details-btn" @click="toggleCard(cardKey('postdoc', p))">
                    {{ openCardKey === cardKey('postdoc', p) ? "Collapse" : "Details" }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- ===== Research Scientist ===== -->
          <section id="sec-rscientist" class="section-block" data-key="rscientist" ref="sectionBlocks">
            <div class="section-head">
              <div class="section-badge">Research Scientist</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in rscientist"
                :key="'rscientist-' + p.name"
                :class="{ open: openCardKey === cardKey('rscientist', p) }"
              >
                <div class="member-photo" aria-hidden="true">
                  <div
                    class="photo-oval zoomable"
                    :class="{ disabled: !p.photo }"
                    @click="p.photo && openImage(p.photo, p.name)"
                  >
                    <img
                      v-if="p.photo"
                      :src="p.photo"
                      :alt="p.name"
                      class="member-photo-img"
                      loading="lazy"
                    />
                    <svg v-else class="member-fallback" viewBox="0 0 24 24" fill="none">
                      <path class="s" d="M12 12a4.3 4.3 0 1 0 0-8.6A4.3 4.3 0 0 0 12 12Z" />
                      <path class="s" d="M4.5 20.2c1.7-4 13.3-4 15 0" />
                      <path class="b" d="M9.6 9.3h4.8" />
                    </svg>

                    <span v-if="p.photo" class="zoom-hint" aria-hidden="true">+</span>
                  </div>
                </div>

                <div class="member-body">
                  <div class="member-name">{{ p.name }}</div>
                  <div class="member-role">{{ p.role }}</div>

                  <div class="member-lines" v-if="p.email">
                    <div class="contact-row">
                      <span class="contact-icon" aria-hidden="true">
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none">
                          <path d="M4 6h16v12H4V6Z" />
                          <path d="M4 7l8 6 8-6" />
                        </svg>
                      </span>
                      <a class="email-link contact-text" :href="mailto(p.email)">{{ p.email }}</a>
                    </div>
                  </div>

                  <div class="member-tags" v-if="p.tags && p.tags.length">
                    <span class="tag-chip" v-for="t in p.tags" :key="t">{{ t }}</span>
                  </div>

                  <div class="details-panel" v-if="openCardKey === cardKey('rscientist', p)">
                    <div class="detail-item" v-if="p.interest">
                      <span class="detail-label">Direction</span>
                      <span class="detail-text">{{ p.interest }}</span>
                    </div>
                    <div class="detail-item" v-if="p.hobby">
                      <span class="detail-label">Hobby</span>
                      <span class="detail-text">{{ p.hobby }}</span>
                    </div>
                  </div>

                  <button class="btn ghost details-btn" @click="toggleCard(cardKey('rscientist', p))">
                    {{ openCardKey === cardKey('rscientist', p) ? "Collapse" : "Details" }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- ===== Research Assistant ===== -->
          <section id="sec-rassistant" class="section-block" data-key="rassistant" ref="sectionBlocks">
            <div class="section-head">
              <div class="section-badge">Research Assistant</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in rassistant"
                :key="'rassistant-' + p.name"
                :class="{ open: openCardKey === cardKey('rassistant', p) }"
              >
                <div class="member-photo" aria-hidden="true">
                  <div
                    class="photo-oval zoomable"
                    :class="{ disabled: !p.photo }"
                    @click="p.photo && openImage(p.photo, p.name)"
                  >
                    <img
                      v-if="p.photo"
                      :src="p.photo"
                      :alt="p.name"
                      class="member-photo-img"
                      loading="lazy"
                    />
                    <svg v-else class="member-fallback" viewBox="0 0 24 24" fill="none">
                      <path class="s" d="M12 12a4.3 4.3 0 1 0 0-8.6A4.3 4.3 0 0 0 12 12Z" />
                      <path class="s" d="M4.5 20.2c1.7-4 13.3-4 15 0" />
                      <path class="b" d="M9.6 9.3h4.8" />
                    </svg>

                    <span v-if="p.photo" class="zoom-hint" aria-hidden="true">+</span>
                  </div>
                </div>

                <div class="member-body">
                  <div class="member-name">{{ p.name }}</div>
                  <div class="member-role">{{ p.role }}</div>

                  <div class="member-lines" v-if="p.email">
                    <div class="contact-row">
                      <span class="contact-icon" aria-hidden="true">
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none">
                          <path d="M4 6h16v12H4V6Z" />
                          <path d="M4 7l8 6 8-6" />
                        </svg>
                      </span>
                      <a class="email-link contact-text" :href="mailto(p.email)">{{ p.email }}</a>
                    </div>
                  </div>

                  <div class="member-tags" v-if="p.tags && p.tags.length">
                    <span class="tag-chip" v-for="t in p.tags" :key="t">{{ t }}</span>
                  </div>

                  <div class="details-panel" v-if="openCardKey === cardKey('rassistant', p)">
                    <div class="detail-item" v-if="p.interest">
                      <span class="detail-label">Direction</span>
                      <span class="detail-text">{{ p.interest }}</span>
                    </div>
                    <div class="detail-item" v-if="p.hobby">
                      <span class="detail-label">Hobby</span>
                      <span class="detail-text">{{ p.hobby }}</span>
                    </div>
                  </div>

                  <button class="btn ghost details-btn" @click="toggleCard(cardKey('rassistant', p))">
                    {{ openCardKey === cardKey('rassistant', p) ? "Collapse" : "Details" }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- ===== PhD ===== -->
          <section id="sec-phd" class="section-block" data-key="phd" ref="sectionBlocks">
            <div class="section-head">
              <div class="section-badge">PhD Student</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in phd"
                :key="'phd-' + p.name"
                :class="{ open: openCardKey === cardKey('phd', p) }"
              >
                <div class="member-photo" aria-hidden="true">
                  <div
                    class="photo-oval zoomable"
                    :class="{ disabled: !p.photo }"
                    @click="p.photo && openImage(p.photo, p.name)"
                  >
                    <img
                      v-if="p.photo"
                      :src="p.photo"
                      :alt="p.name"
                      class="member-photo-img"
                      loading="lazy"
                    />
                    <svg v-else class="member-fallback" viewBox="0 0 24 24" fill="none">
                      <path class="s" d="M12 12a4.3 4.3 0 1 0 0-8.6A4.3 4.3 0 0 0 12 12Z" />
                      <path class="s" d="M4.5 20.2c1.7-4 13.3-4 15 0" />
                      <path class="b" d="M9.6 9.3h4.8" />
                    </svg>

                    <span v-if="p.photo" class="zoom-hint" aria-hidden="true">+</span>
                  </div>
                </div>

                <div class="member-body">
                  <div class="member-name">{{ p.name }}</div>
                  <div class="member-role">{{ p.role }}</div>

                  <div class="member-lines" v-if="p.email">
                    <div class="contact-row">
                      <span class="contact-icon" aria-hidden="true">
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none">
                          <path d="M4 6h16v12H4V6Z" />
                          <path d="M4 7l8 6 8-6" />
                        </svg>
                      </span>
                      <a class="email-link contact-text" :href="mailto(p.email)">{{ p.email }}</a>
                    </div>
                  </div>

                  <div class="member-tags" v-if="p.tags && p.tags.length">
                    <span class="tag-chip" v-for="t in p.tags" :key="t">{{ t }}</span>
                  </div>

                  <div class="details-panel" v-if="openCardKey === cardKey('phd', p)">
                    <div class="detail-item" v-if="p.interest">
                      <span class="detail-label">Direction</span>
                      <span class="detail-text">{{ p.interest }}</span>
                    </div>
                    <div class="detail-item" v-if="p.hobby">
                      <span class="detail-label">Hobby</span>
                      <span class="detail-text">{{ p.hobby }}</span>
                    </div>
                  </div>

                  <button class="btn ghost details-btn" @click="toggleCard(cardKey('phd', p))">
                    {{ openCardKey === cardKey('phd', p) ? "Collapse" : "Details" }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- ===== Master ===== -->
          <section id="sec-master" class="section-block" data-key="master" ref="sectionBlocks">
            <div class="section-head">
              <div class="section-badge">Master Student</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in master"
                :key="'master-' + p.name"
                :class="{ open: openCardKey === cardKey('master', p) }"
              >
                <div class="member-photo" aria-hidden="true">
                  <div
                    class="photo-oval zoomable"
                    :class="{ disabled: !p.photo }"
                    @click="p.photo && openImage(p.photo, p.name)"
                  >
                    <img
                      v-if="p.photo"
                      :src="p.photo"
                      :alt="p.name"
                      class="member-photo-img"
                      loading="lazy"
                    />
                    <svg v-else class="member-fallback" viewBox="0 0 24 24" fill="none">
                      <path class="s" d="M12 12a4.3 4.3 0 1 0 0-8.6A4.3 4.3 0 0 0 12 12Z" />
                      <path class="s" d="M4.5 20.2c1.7-4 13.3-4 15 0" />
                      <path class="b" d="M9.6 9.3h4.8" />
                    </svg>

                    <span v-if="p.photo" class="zoom-hint" aria-hidden="true">+</span>
                  </div>
                </div>

                <div class="member-body">
                  <div class="member-name">{{ p.name }}</div>
                  <div class="member-role">{{ p.role }}</div>

                  <div class="member-lines" v-if="p.email">
                    <div class="contact-row">
                      <span class="contact-icon" aria-hidden="true">
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none">
                          <path d="M4 6h16v12H4V6Z" />
                          <path d="M4 7l8 6 8-6" />
                        </svg>
                      </span>
                      <a class="email-link contact-text" :href="mailto(p.email)">{{ p.email }}</a>
                    </div>
                  </div>

                  <div class="member-tags" v-if="p.tags && p.tags.length">
                    <span class="tag-chip" v-for="t in p.tags" :key="t">{{ t }}</span>
                  </div>

                  <div class="details-panel" v-if="openCardKey === cardKey('master', p)">
                    <div class="detail-item" v-if="p.interest">
                      <span class="detail-label">Direction</span>
                      <span class="detail-text">{{ p.interest }}</span>
                    </div>
                    <div class="detail-item" v-if="p.hobby">
                      <span class="detail-label">Hobby</span>
                      <span class="detail-text">{{ p.hobby }}</span>
                    </div>
                  </div>

                  <button class="btn ghost details-btn" @click="toggleCard(cardKey('master', p))">
                    {{ openCardKey === cardKey('master', p) ? "Collapse" : "Details" }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- ===== Undergraduate ===== -->
          <section id="sec-undergrad" class="section-block" data-key="undergrad" ref="sectionBlocks">
            <div class="section-head">
              <div class="section-badge">Undergraduate</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in undergrad"
                :key="'ug-' + p.name"
                :class="{ open: openCardKey === cardKey('undergrad', p) }"
              >
                <div class="member-photo" aria-hidden="true">
                  <div
                    class="photo-oval zoomable"
                    :class="{ disabled: !p.photo }"
                    @click="p.photo && openImage(p.photo, p.name)"
                  >
                    <img
                      v-if="p.photo"
                      :src="p.photo"
                      :alt="p.name"
                      class="member-photo-img"
                      loading="lazy"
                    />
                    <svg v-else class="member-fallback" viewBox="0 0 24 24" fill="none">
                      <path class="s" d="M12 12a4.3 4.3 0 1 0 0-8.6A4.3 4.3 0 0 0 12 12Z" />
                      <path class="s" d="M4.5 20.2c1.7-4 13.3-4 15 0" />
                      <path class="b" d="M9.6 9.3h4.8" />
                    </svg>

                    <span v-if="p.photo" class="zoom-hint" aria-hidden="true">+</span>
                  </div>
                </div>

                <div class="member-body">
                  <div class="member-name">{{ p.name }}</div>
                  <div class="member-role">{{ p.role }}</div>

                  <div class="member-lines" v-if="p.email">
                    <div class="contact-row">
                      <span class="contact-icon" aria-hidden="true">
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none">
                          <path d="M4 6h16v12H4V6Z" />
                          <path d="M4 7l8 6 8-6" />
                        </svg>
                      </span>
                      <a class="email-link contact-text" :href="mailto(p.email)">{{ p.email }}</a>
                    </div>
                  </div>

                  <div class="member-tags" v-if="p.tags && p.tags.length">
                    <span class="tag-chip" v-for="t in p.tags" :key="t">{{ t }}</span>
                  </div>

                  <div class="details-panel" v-if="openCardKey === cardKey('undergrad', p)">
                    <div class="detail-item" v-if="p.interest">
                      <span class="detail-label">Direction</span>
                      <span class="detail-text">{{ p.interest }}</span>
                    </div>
                    <div class="detail-item" v-if="p.hobby">
                      <span class="detail-label">Hobby</span>
                      <span class="detail-text">{{ p.hobby }}</span>
                    </div>
                  </div>

                  <button class="btn ghost details-btn" @click="toggleCard(cardKey('undergrad', p))">
                    {{ openCardKey === cardKey('undergrad', p) ? "Collapse" : "Details" }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- ===== Visiting ===== -->
          <section id="sec-visiting" class="section-block" data-key="visiting" ref="sectionBlocks">
            <div class="section-head">
              <div class="section-badge">Visiting</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in visiting"
                :key="'visiting-' + p.name"
                :class="{ open: openCardKey === cardKey('visiting', p) }"
              >
                <div class="member-photo" aria-hidden="true">
                  <div
                    class="photo-oval zoomable"
                    :class="{ disabled: !p.photo }"
                    @click="p.photo && openImage(p.photo, p.name)"
                  >
                    <img
                      v-if="p.photo"
                      :src="p.photo"
                      :alt="p.name"
                      class="member-photo-img"
                      loading="lazy"
                    />
                    <svg v-else class="member-fallback" viewBox="0 0 24 24" fill="none">
                      <path class="s" d="M12 12a4.3 4.3 0 1 0 0-8.6A4.3 4.3 0 0 0 12 12Z" />
                      <path class="s" d="M4.5 20.2c1.7-4 13.3-4 15 0" />
                      <path class="b" d="M9.6 9.3h4.8" />
                    </svg>

                    <span v-if="p.photo" class="zoom-hint" aria-hidden="true">+</span>
                  </div>
                </div>

                <div class="member-body">
                  <div class="member-name">{{ p.name }}</div>
                  <div class="member-role">{{ p.role }}</div>

                  <div class="member-lines" v-if="p.email">
                    <div class="contact-row">
                      <span class="contact-icon" aria-hidden="true">
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none">
                          <path d="M4 6h16v12H4V6Z" />
                          <path d="M4 7l8 6 8-6" />
                        </svg>
                      </span>
                      <a class="email-link contact-text" :href="mailto(p.email)">{{ p.email }}</a>
                    </div>
                  </div>

                  <div class="member-tags" v-if="p.tags && p.tags.length">
                    <span class="tag-chip" v-for="t in p.tags" :key="t">{{ t }}</span>
                  </div>

                  <div class="details-panel" v-if="openCardKey === cardKey('visiting', p)">
                    <div class="detail-item" v-if="p.interest">
                      <span class="detail-label">Direction</span>
                      <span class="detail-text">{{ p.interest }}</span>
                    </div>
                    <div class="detail-item" v-if="p.hobby">
                      <span class="detail-label">Hobby</span>
                      <span class="detail-text">{{ p.hobby }}</span>
                    </div>
                  </div>

                  <button class="btn ghost details-btn" @click="toggleCard(cardKey('visiting', p))">
                    {{ openCardKey === cardKey('visiting', p) ? "Collapse" : "Details" }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- ===== Alumni ===== -->
          <section id="sec-alumni" class="section-block" data-key="alumni" ref="sectionBlocks">
            <div class="section-head">
              <div class="section-badge">Alumni</div>
            </div>

            <div class="alumni-card">
              <div class="alumni-row" v-for="a in alumni" :key="a">
                <span class="dot" aria-hidden="true"></span>
                <span class="alumni-name">
                  <span class="alumni-name-strong">{{ a.name }}</span><span class="alumni-rest">, {{ a.detail }}</span>
                </span>
              </div>
            </div>
          </section>
        </div>
        <!-- /people-content-board -->
      </div>
      <!-- /people-container -->

      <!-- ✅ Lightbox：点击成员照片放大（不包含 PI） -->
      <div v-if="lightbox.open" class="lightbox" @click="closeImage">
        <div class="lightbox-inner" @click.stop>
          <button class="lightbox-close" @click="closeImage" aria-label="Close">✕</button>
          <img :src="lightbox.src" :alt="lightbox.alt" class="lightbox-img" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PeoplePage",
  data() {
    return {
      activeSection: "pi",
      observer: null,
      scrollOffset: 90,
      openCardKey: null,

      // ✅ 图片放大预览
      lightbox: {
        open: false,
        src: "",
        alt: ""
      },

      sections: [
        { key: "pi", label: "Principal Investigator" },
        { key: "postdoc", label: "Postdoctoral Fellow" },
        { key: "rscientist", label: "Research Scientist" },
        { key: "rassistant", label: "Research Assistant" },
        { key: "phd", label: "PhD Student" },
        { key: "master", label: "Master Student" },
        { key: "undergrad", label: "Undergraduate" },
        { key: "visiting", label: "Visiting" },
        { key: "alumni", label: "Alumni" }
      ],

      pi: {
        name: "Dr. Yang Wu",
        role: "Principal Investigator",
        tags: ["Statistical Genetics", "Multi-omics", "Population Health"],
        intro:
          "Yang Wu is a Principal Investigator at West China Hospital, Sichuan University. He received his Ph.D. from The University of Queensland (UQ). Following his doctoral training, he undertook postdoctoral research at UQ and the University of California. He later joined West China Hospital, Sichuan University as a principal investigator. He has been recognized as one of The Australian’s “Five Rising Stars in Life Sciences” and has received multiple prestigious awards, including the National Outstanding Self-Financed Students Abroad Scholarship.",
        email: "yang.wu@wchscu.cn",
        office: "Chengdu Frontiers Medical Center, D5A 416",
        photo: require("@/assets/people/wuyang.jpg"),
        profileLink: "https://yjs.cd120.com/contents/603/3225.html",
        publicationsLink: "https://scholar.google.com/citations?user=Xu-FkbkAAAAJ&hl=zh-CN&oi=ao",
        researchgateLink: "https://www.researchgate.net/profile/Yang-Wu-4",
      },

      postdocs: [
        {
          name: "Fang Wang",
          role: "Postdoctoral Fellow",
          tags: ["Human Genomics", "Genetic Variation", "Population Genetics"],
          email: "wangfang0846@wchscu.edu.cn",
          interest: "Human Genomics; Population Genetics",
          hobby: "Hiking",
          photo: require("@/assets/people/wangfang.jpg")
        },
        {
          name: "Tianpeng Chang",
          role: "Postdoctoral Fellow",
          tags: ["scRNA", "Mendelian Randomization", "Multi-omics"],
          email: "changtianpeng@wchscu.edu.cn",
          interest: "Single-cell omics; Mendelian Randomization; Multi-omics",
          hobby: "Basketball, Traveling",
          photo: require("@/assets/people/changtianpeng.jpg")
        }
      ],

      rscientist: [
        {
          name: "Wenjian Li",
          role: "Data Analysis Engineer",
          tags: ["AI", "Big Data", "Machine Learning"],
          email: "liwenjian@wchscu.edu.cn",
          interest:
            "Data and computational resource management and optimization; big data modeling and artificial intelligence; high-performance statistical genetics algorithms and software development.",
          hobby: "Death",
          photo: require("@/assets/people/liwenjian.jpg")
        }
      ],

      rassistant: [
        {
          name: "Kai Gai",
          role: "Research Assistant",
          tags: ["Rare variants", "Multi-omics", "Mendelian Randomization"],
          email: "gaikai@wchscu.edu.cn",
          interest:
            "Investigating rare variant burden in rare diseases, and performing Mendelian randomization and multi-omics integration analyses in complex diseases.",
          hobby: "Music",
          photo: require("@/assets/people/gaikai.jpg")
        },
        {
          name: "Haibing He",
          role: "Research Assistant",
          tags: ["scRNA Multi-omics", "Precision Medicine", "GWAS"],
          email: "hehb@wchscu.cn",
          interest: "Integrating population genetics and single-cell multi-omics to interpret genetic variants, identify disease-relevant cell types, and develop computational methods for precision medicine.s",
          hobby: "Play",
          photo: require("@/assets/people/hehaibing.jpg")
        },
        {
          name: "Zesong Cheng",
          role: "Research Assistant",
          tags: ["Multi-omics", "Machine Learning", "Risk Prediction"],
          email: "cheng_zesong@wchscu.edu.cn",
          interest:
            "Integration of large-scale population cohorts and multi-omics data with machine learning and genetic epidemiology to model disease risk and elucidate life-course mechanisms of aging and cardiometabolic diseases.",
          hobby: "Table tennis, badminton",
          photo: require("@/assets/people/chengzesong.jpg")
        },
      ],

      phd: [
      {
          name: "Junpeng Li",
          role: "PhD Student",
          tags: ["Multi-omics", "Complex Diseases", "Large-scale Cohort Analysis"],
          email: "lijunpeng1@stu.scu.edu.cn",
          interest: "Leveraging large-scale genetic cohorts (e.g., UK Biobank) and integrative multi-omics analyses to dissect disease mechanisms, identify shared molecular pathways and genetic architectures across diseases, and uncover potential therapeutic targets for precision medicine.",
          hobby: "Swimming, badminton, roller skating, movies, music, and gaming",
          photo: require("@/assets/people/lijunpeng.jpg")
        },
       {
          name: "Lulu Shi",
          role: "PhD Student",
          tags: ["GWAS Meta-analysis", "Multi-omics", "Method Development"],
          email: "shilulu@stu.wchscu.cn",
          interest:
            "Multi-ancestry GWAS and integrative genomic analyses of complex diseases, and algorithm development for omics integration.",
          hobby: "Cycling, Music, LOL",
          photo: require("@/assets/people/shilulu.jpg")
        },
        {
          name: "Hongceng Jiang",
          role: "PhD Student",
          tags: ["scRNA", "Genetic Susceptibility", "Cell-type-specific Mechanisms"],
          email: "jianghongcen9@stu.scu.edu.cn",
          interest: "Cellular development and disease-associated cell types, Genetic susceptibility of rare diseases",
          hobby: "Photography, Animation",
          photo: require("@/assets/people/jianghongceng.jpg")
        },
        {
          name: "Wenfeng Yi",
          role: "PhD Student",
          tags: ["Multi-omics ", "GWAS", "Method Development"],
          email: "yiwenfeng@stu.scu.edu.cn",
          interest: "Method development for multi-ancestry GWAS analysis, multi-omics data analysis",
          hobby: "Gaming, Cycling, Walking",
          photo: require("@/assets/people/yiwenfeng.jpg")
        },
        {
          name: "Miaomiao Tang",
          role: "PhD Student",
          tags: ["Mendelian Randomization", "ROH", "Endogenous Retroviruses (ERVs)"],
          email: "tangmiaomiao@wchscu.cn",
          interest:
            "Integrative human genomics and population genetics to dissect the genetic architecture of brain-related traits, rare diseases, and complex traits—leveraging Mendelian randomization, ROH analyses, whole-genome sequencing of ERVs, and evolutionary perspectives on environmental selection.",
          hobby: "Cycling, swimming, badminton",
          photo: require("@/assets/people/tangmiaomiao.jpg")
        }
      ],

      master: [
        {
          name: "Ke Yu",
          role: "Master Student",
          tags: ["Multi-trait Analysis", "Complex Traits", "Method Development"],
          email: "yuke123@stu.scu.edu.cn",
          interest: "Investigating the relationships and shared genetic architecture among multiple traits, with an emphasis on algorithm development for large-scale integrative and multivariate genetic analyses.",
          hobby: "Game",
          photo: require("@/assets/people/yuke.jpg")
        },
        {
          name: "Yiqing Yan",
          role: "Master Student",
          tags: ["GWAS Meta-analysis", "Complex Traits", "Multi-omics"],
          email: "yanyiqing@stu.scu.edu.cn",
          interest: "GWAS and multi‑omics integration to investigate the genetic architecture underlying complex diseases.",
          hobby: "Music, Table tennis",
          photo: require("@/assets/people/yanyiqing.jpg")
        }
      ],

      undergrad: [
        {
          name: "Enlai Cai",
          role: "Undergraduate",
          tags: ["GWAS Meta-analysis", "Complex Traits", "Multi-omics"],
          email: "caienlai@stu.scu.edu.cn",
          interest: "GWAS and multi-organ omics disease research",
          hobby: "Music, football",
          photo: require("@/assets/people/caienlai.jpg")
        }
      ],

      visiting: [
        {
          name: "Xinyuan Zhang",
          role: "PhD Student, WCSH of SCU",
          tags: ["Medical Imaging", "Health", "Chest Radiology"],
          email: "altman_0302@163.com",
          interest: "Cardiothoracic Imaging",
          hobby: "Music",
          photo: require("@/assets/people/zhangxinyuan.jpg")
        },
        {
          name: "Jingya Gao",
          role: "Visiting Student",
          tags: ["Immunogenetics", "Large-scale Genomics"],
          email: "gaojingya@stu.scu.edu.cn",
          interest: "Integrating real-world clinical cohorts with large-scale genetic data to elucidate the genetic mechanisms underlying immune-related dermatologic and systemic diseases, supporting clinical stratification and precision treatment.",
          hobby: "Drawing, Guitar",
          photo: require("@/assets/people/gaojingya.jpg")
        },
        { 
          name: "Hanbing Wang",
          role: "PhD Student, WCH of SCU",
          tags: ["Chronic Pain", "Multi-omics", "Integrative Genomics"],
          email: "hanbingwang0724@163.con",
          interest: "Multi-omics analysis of chronic pain",
          hobby: "Cooking, handicrafts, Rubik’s cube",
          photo: require("@/assets/people/wanghanbing.jpg")
        }
      ],

      alumni: [
        {
          name: "Ziyu Wang",
          detail: "visiting student (2026). — Now at Wenzhou Medical University."
        },
        {
          name: "Ming Zhu",
          detail: "visiting student (2024, 2026). — Now at Wenzhou Medical University."
        },
        {
          name: "Kanglu Pei",
          detail: "visiting student (2024). — Now Master student at the University of Oxford."
        },
      ]
    };
  },

  mounted() {
    this.activeSection = this.sections[0].key;
    this.initObserver();
    window.addEventListener("keydown", this.onKeydown);
  },

  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
    window.removeEventListener("keydown", this.onKeydown);
  },

  methods: {
    mailto(email) {
      const e = (email || "").toString().trim();
      return e ? `mailto:${e}` : "#";
    },
    cardKey(group, p) {
      return `${group}:${p.name}`;
    },

    toggleCard(key) {
      this.openCardKey = this.openCardKey === key ? null : key;
    },

    openImage(src, alt) {
      this.lightbox.open = true;
      this.lightbox.src = src;
      this.lightbox.alt = alt || "Photo";
      document.body.style.overflow = "hidden";
    },

    closeImage() {
      this.lightbox.open = false;
      this.lightbox.src = "";
      this.lightbox.alt = "";
      document.body.style.overflow = "";
    },

    onKeydown(e) {
      if (e.key === "Escape" && this.lightbox.open) this.closeImage();
    },

    scrollToSection(key) {
      const el = document.getElementById(`sec-${key}`);
      if (!el) return;

      this.activeSection = key;

      const top = el.getBoundingClientRect().top + window.pageYOffset - this.scrollOffset;
      window.scrollTo({ top, behavior: "smooth" });
    },

    initObserver() {
      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const key = entry.target.dataset.key;
              if (key) this.activeSection = key;
            }
          });
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
      );

      this.$nextTick(() => {
        const raw = this.$refs.sectionBlocks;
        const blocks = Array.isArray(raw) ? raw : raw ? [raw] : [];
        blocks.forEach(sec => {
          const el = sec && sec.$el ? sec.$el : sec;
          if (el instanceof HTMLElement) this.observer.observe(el);
        });
      });
    }
  }
};
</script>

<style scoped>
.people-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.people-shell {
  width: 100%;
  max-width: 1200px;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* ✅ People 左对齐（在左侧导航栏上方） */
.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  text-align: left;
  margin-bottom: 24px;

  visibility: hidden; /* ✅ 不显示文字，但保留占位，模块位置不变 */
}

.people-container {
  display: flex;
  width: 100%;
  text-align: left;
}

/* ✅ 左侧导航栏左对齐（与 publications 一致） */
.year-sidebar {
  width: 70px;
  margin-right: 20px;
  margin-left: -20px;   /* ✅ 往左移：-10/-20/-30 自己调 */
  position: sticky;

  /* ✅ 放到左侧“中上”位置：从 header 下方开始固定偏移 */
  top: 22%;            /* 你想更靠下就 160/180 */
  transform: none;       /* ✅ 去掉居中偏移 */

  align-self: flex-start;
  text-align: left;
}


.year-link {
  font-size: 16px;
  font-weight: 600;
  color: #9aa4af;
  cursor: pointer;
  margin-bottom: 12px;
  transition: color 0.15s ease;
  white-space: nowrap;
  text-align: left;
}

.year-link.active {
  color: #004680;
}

.year-link:hover {
  text-decoration: underline;
}

/* 右侧底板 */
.people-content-board {
  flex: 1;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  background: #ffffff;
  border-radius: 16px;
  padding: 28px 32px;
  border: 1px solid #e3ebf5;
  box-shadow: 0 4px 14px rgba(15, 60, 120, 0.08);

  --accent: #2f5d8a;
  --border: #e3ebf5;
  --shadow: 0 4px 14px rgba(15, 60, 120, 0.08);
  --shadowHover: 0 16px 36px rgba(15, 60, 120, 0.16);
  --ink: #7b7b7b;
  --blue: #7fc4ff;

  --gap: 10px;
}

.section-head {
  display: flex;
  justify-content: flex-start;
  margin: 22px 0 12px;
}
.section-badge {
  width: 220px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;

  background: #f0f4fb;
  border-radius: 12px;
  padding: 0 12px;
  box-shadow: 0 4px 12px rgba(15, 60, 120, 0.08);
  color: #1a3e6e;
  font-weight: 800;
  font-size: 20px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.section-block {
  margin-bottom: 34px;
}

.people-grid {
  display: grid;
  gap: 18px;
}
.people-grid.one {
  grid-template-columns: 1fr;
}
.people-grid.three {
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

/* ===== PI ===== */
.person-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.pi-card {
  padding: 22px;
  display: flex;
  gap: 18px;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.pi-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadowHover);
}

/* PI 二寸照比例（保持 0.75） */
.pi-photo {
  flex: 0 0 auto;
  --piH: 240px;
  height: var(--piH);
  width: calc(var(--piH) * 0.75);
  border-radius: 14px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  background: #fff;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  /* ✅ 让其支持点击样式 */
  position: relative;
}

/* ✅ 点击放大：支持鼠标手势 */
.pi-photo.zoomable {
  cursor: pointer;
}
.pi-photo.zoomable.disabled {
  cursor: default;
}

.pi-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}
.pi-fallback {
  width: 90px;
  height: 90px;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.person-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.person-top {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.name {
  font-size: 22px;
  font-weight: 800;
  color: var(--accent);
}
.role {
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

/* ✅ PI 介绍 */
.pi-intro {
  margin: 2px 0 6px 0;
  font-size: 15px;
  line-height: 1.7;
  color: #444;
  text-align: left;
  word-break: break-word;
  overflow-wrap: anywhere;
}

/* PI tags（保留你原来的内容，不动） */
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
}

/* 通用 chip */
.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: #fff;
  color: #555;
  line-height: 1;
}

/* ✅ 图标与文字：严格垂直居中对齐 */
.contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

/* ✅ 图标：无白底 */
.contact-icon {
  width: 22px;
  height: 22px;
  border-radius: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

/* 图标本体 */
.icon-sm {
  display: block;
  width: 22px;
  height: 22px;
  stroke: var(--accent);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

/* 文字 */
.contact-text {
  display: block;
  line-height: 1.4;
  font-size: 14px;
  color: #444;
  word-break: break-word;
  overflow-wrap: anywhere;
}

/* ✅ 邮箱链接：默认下划线 + 可点击写邮件 */
.email-link{
  color: inherit;                 /* 跟 .contact-text 一致 */
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: rgba(47,93,138,0.45);
  cursor: pointer;
  transition: color .15s ease, text-decoration-color .15s ease, transform .15s ease;
}

.email-link:hover{
  color: var(--accent);
  text-decoration-color: rgba(47,93,138,0.9);
  transform: translateY(-1px);
}

/* PI info */
.pi-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 2px;
}

/* actions */
.actions {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  color: #111;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 2px 8px rgba(15, 60, 120, 0.06);
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(15, 60, 120, 0.10);
}
.btn.ghost {
  background: #f7fbff;
}

/* ===== Members ===== */
.mini-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}
.member-card {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.member-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadowHover);
}

.member-photo {
  width: 100%;
  padding: 14px 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-oval {
  --w: 120px;
  --h: 150px;
  width: var(--w);
  height: var(--h);
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ✅ 点击放大提示 */
.photo-oval.zoomable {
  cursor: pointer;
  position: relative;
}
.photo-oval.zoomable.disabled {
  cursor: default;
}
.zoom-hint {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  pointer-events: none;
}

/* 图片完整显示 */
.member-photo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  background: transparent;
}

.member-fallback {
  width: 60px;
  height: 60px;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

/* strokes */
.s { stroke: var(--ink); stroke-width: 2.4; }
.b { stroke: var(--blue); stroke-width: 3.2; stroke-linecap: round; }

.member-body {
  padding: 14px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

/* name/role 居中 */
.member-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--accent);
  line-height: 1.2;
  text-align: center;
}
.member-role {
  font-size: 13px;
  color: #666;
  font-weight: 600;
  margin-top: -6px;
  text-align: center;
}

/* ✅ 邮箱块：左对齐 */
.member-lines {
  width: 100%;
  display: block;
}

/* ✅ 每个 tag 自带底板（单独 chip），自动换行不溢出 */
.member-tags {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 2px;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: #fff;
  color: #555;
  line-height: 1;
  box-shadow: 0 2px 8px rgba(15, 60, 120, 0.06);
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* details */
.details-panel {
  margin-top: 6px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

/* ✅ details：一行显示 label + 描述 */
.detail-item {
  text-align: left;
  line-height: 1.6;
}
.detail-label {
  font-size: 12px;
  font-weight: 800;
  color: #888;
  margin-right: 8px;
  white-space: nowrap;
}
.detail-text {
  font-size: 14px;
  color: #444;
  font-weight: 600;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.detail-item + .detail-item {
  margin-top: 12px;
}

.details-btn {
  width: fit-content;
  align-self: flex-start;
  margin-top: 6px;
}

/* alumni */
.alumni-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 18px;
}
.alumni-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 6px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(47, 93, 138, 0.35);
}
.alumni-name {
  color: #444;
  font-size: 16px;
}

.alumni-name-strong {
  color: #2f5d8a;
  font-weight: 900;
}

.alumni-rest {
  color: #444;
  font-weight: 600;
}


/* ✅ Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}
.lightbox-inner {
  position: relative;
  max-width: min(920px, 95vw);
  max-height: 92vh;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.35);
}
.lightbox-img {
  display: block;
  max-width: 95vw;
  max-height: 92vh;
  object-fit: contain;
  background: #fff;
}
.lightbox-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.9);
  cursor: pointer;
  font-size: 18px;
  line-height: 32px;
}

/* responsive */
@media (max-width: 1024px) {
  .people-grid.three {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .year-sidebar {
    display: none;
  }
  .people-content-board {
    padding: 22px 18px;
  }
  .people-grid.three {
    grid-template-columns: 1fr;
  }

  .pi-card {
    flex-direction: column;
    align-items: center;
  }
  .pi-photo {
    order: -1;
    --piH: 260px;
    height: var(--piH);
    width: calc(var(--piH) * 0.66);
  }
}
</style>