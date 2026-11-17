<template>
  <div class="people-wrapper">
    <div class="people-shell">
      <!-- ✅ People 放在左侧导航栏上方，左对齐 -->
      <h1 class="page-title">People</h1>

      <div class="people-container">
        <!-- 左侧导航 -->
        <nav class="year-sidebar" aria-label="Sections">
          <div
            v-for="s in sections"
            :key="s.key"
            class="year-link"
            :class="{ active: activeSection === s.key }"
            role="button"
            tabindex="0"
            :aria-current="activeSection === s.key ? 'true' : undefined"
            @click="scrollToSection(s.key)"
            @keyup.enter="scrollToSection(s.key)"
          >
            <span class="year-label">{{ s.nav || s.label }}</span>
            <span class="year-count">{{ counts[s.key] }}</span>
          </div>
        </nav>

        <!-- 右侧正文底板 -->
        <div class="people-content-board">

          <!-- ===== PI ===== -->
          <section id="sec-pi" class="section-block" data-key="pi">
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
          <section id="sec-postdoc" class="section-block" data-key="postdoc">
            <div class="section-head">
              <div class="section-badge">Postdoctoral Fellow</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in postdocs"
                :key="'postdoc-' + p.name"
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
                  <!-- ✅ 姓名（左对齐）+ 细分隔线 -->
                  <div class="member-name">{{ p.name }}</div>
                  <span class="member-divider" aria-hidden="true"></span>

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
                  <!-- ✅ 小字补充：研究方向 / 标签 / 爱好 -->
                  <div class="member-extra" v-if="p.interest || (p.tags && p.tags.length) || p.hobby">
                    <div class="member-tags" v-if="p.tags && p.tags.length">
                      <span class="member-tag" v-for="t in p.tags" :key="t">{{ t }}</span>
                    </div>

                    <p
                      class="member-interest"
                      v-if="p.interest"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >{{ p.interest }}</p>

                    <p
                      class="member-hobby"
                      v-if="p.hobby"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >Hobby: {{ p.hobby }}</p>
                  </div>

                </div>
              </div>
            </div>
          </section>

          <!-- ===== Research Scientist ===== -->
          <section id="sec-rscientist" class="section-block" data-key="rscientist">
            <div class="section-head">
              <div class="section-badge">Research Scientist</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in rscientist"
                :key="'rscientist-' + p.name"
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
                  <!-- ✅ 姓名（左对齐）+ 细分隔线 -->
                  <div class="member-name">{{ p.name }}</div>
                  <span class="member-divider" aria-hidden="true"></span>

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
                  <!-- ✅ 小字补充：研究方向 / 标签 / 爱好 -->
                  <div class="member-extra" v-if="p.interest || (p.tags && p.tags.length) || p.hobby">
                    <div class="member-tags" v-if="p.tags && p.tags.length">
                      <span class="member-tag" v-for="t in p.tags" :key="t">{{ t }}</span>
                    </div>

                    <p
                      class="member-interest"
                      v-if="p.interest"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >{{ p.interest }}</p>

                    <p
                      class="member-hobby"
                      v-if="p.hobby"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >Hobby: {{ p.hobby }}</p>
                  </div>

                </div>
              </div>
            </div>
          </section>

          <!-- ===== Research Assistant ===== -->
          <section id="sec-rassistant" class="section-block" data-key="rassistant">
            <div class="section-head">
              <div class="section-badge">Research Assistant</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in rassistant"
                :key="'rassistant-' + p.name"
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
                  <!-- ✅ 姓名（左对齐）+ 细分隔线 -->
                  <div class="member-name">{{ p.name }}</div>
                  <span class="member-divider" aria-hidden="true"></span>

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
                  <!-- ✅ 小字补充：研究方向 / 标签 / 爱好 -->
                  <div class="member-extra" v-if="p.interest || (p.tags && p.tags.length) || p.hobby">
                    <div class="member-tags" v-if="p.tags && p.tags.length">
                      <span class="member-tag" v-for="t in p.tags" :key="t">{{ t }}</span>
                    </div>

                    <p
                      class="member-interest"
                      v-if="p.interest"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >{{ p.interest }}</p>

                    <p
                      class="member-hobby"
                      v-if="p.hobby"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >Hobby: {{ p.hobby }}</p>
                  </div>

                </div>
              </div>
            </div>
          </section>

          <!-- ===== PhD ===== -->
          <section id="sec-phd" class="section-block" data-key="phd">
            <div class="section-head">
              <div class="section-badge">PhD Student</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in phd"
                :key="'phd-' + p.name"
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
                  <!-- ✅ 姓名（左对齐）+ 细分隔线 -->
                  <div class="member-name">{{ p.name }}</div>
                  <span class="member-divider" aria-hidden="true"></span>

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
                  <!-- ✅ 小字补充：研究方向 / 标签 / 爱好 -->
                  <div class="member-extra" v-if="p.interest || (p.tags && p.tags.length) || p.hobby">
                    <div class="member-tags" v-if="p.tags && p.tags.length">
                      <span class="member-tag" v-for="t in p.tags" :key="t">{{ t }}</span>
                    </div>

                    <p
                      class="member-interest"
                      v-if="p.interest"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >{{ p.interest }}</p>

                    <p
                      class="member-hobby"
                      v-if="p.hobby"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >Hobby: {{ p.hobby }}</p>
                  </div>

                </div>
              </div>
            </div>
          </section>

          <!-- ===== Master ===== -->
          <section id="sec-master" class="section-block" data-key="master">
            <div class="section-head">
              <div class="section-badge">Master Student</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in master"
                :key="'master-' + p.name"
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
                  <!-- ✅ 姓名（左对齐）+ 细分隔线 -->
                  <div class="member-name">{{ p.name }}</div>
                  <span class="member-divider" aria-hidden="true"></span>

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
                  <!-- ✅ 小字补充：研究方向 / 标签 / 爱好 -->
                  <div class="member-extra" v-if="p.interest || (p.tags && p.tags.length) || p.hobby">
                    <div class="member-tags" v-if="p.tags && p.tags.length">
                      <span class="member-tag" v-for="t in p.tags" :key="t">{{ t }}</span>
                    </div>

                    <p
                      class="member-interest"
                      v-if="p.interest"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >{{ p.interest }}</p>

                    <p
                      class="member-hobby"
                      v-if="p.hobby"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >Hobby: {{ p.hobby }}</p>
                  </div>

                </div>
              </div>
            </div>
          </section>

          <!-- ===== Undergraduate ===== -->
          <section id="sec-undergrad" class="section-block" data-key="undergrad">
            <div class="section-head">
              <div class="section-badge">Undergraduate</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in undergrad"
                :key="'ug-' + p.name"
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
                  <!-- ✅ 姓名（左对齐）+ 细分隔线 -->
                  <div class="member-name">{{ p.name }}</div>
                  <span class="member-divider" aria-hidden="true"></span>

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
                  <!-- ✅ 小字补充：研究方向 / 标签 / 爱好 -->
                  <div class="member-extra" v-if="p.interest || (p.tags && p.tags.length) || p.hobby">
                    <div class="member-tags" v-if="p.tags && p.tags.length">
                      <span class="member-tag" v-for="t in p.tags" :key="t">{{ t }}</span>
                    </div>

                    <p
                      class="member-interest"
                      v-if="p.interest"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >{{ p.interest }}</p>

                    <p
                      class="member-hobby"
                      v-if="p.hobby"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >Hobby: {{ p.hobby }}</p>
                  </div>

                </div>
              </div>
            </div>
          </section>

          <!-- ===== Visiting ===== -->
          <section id="sec-visiting" class="section-block" data-key="visiting">
            <div class="section-head">
              <div class="section-badge">Visiting</div>
            </div>

            <div class="people-grid three">
              <div
                class="mini-card member-card"
                v-for="p in visiting"
                :key="'visiting-' + p.name"
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
                  <!-- ✅ 姓名（左对齐）+ 细分隔线 -->
                  <div class="member-name">{{ p.name }}</div>
                  <span class="member-divider" aria-hidden="true"></span>

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
                  <!-- ✅ 小字补充：研究方向 / 标签 / 爱好 -->
                  <div class="member-extra" v-if="p.interest || (p.tags && p.tags.length) || p.hobby">
                    <div class="member-tags" v-if="p.tags && p.tags.length">
                      <span class="member-tag" v-for="t in p.tags" :key="t">{{ t }}</span>
                    </div>

                    <p
                      class="member-interest"
                      v-if="p.interest"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >{{ p.interest }}</p>

                    <p
                      class="member-hobby"
                      v-if="p.hobby"
                      title="Click for full details"
                      @click="openDetail(p)"
                    >Hobby: {{ p.hobby }}</p>
                  </div>

                </div>
              </div>
            </div>
          </section>

          <!-- ===== Alumni ===== -->
          <section id="sec-alumni" class="section-block" data-key="alumni">
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
      <!-- ✅ 研究方向详情：点击小字展开查看全文 -->
      <div v-if="detail.open" class="detail-modal" @click="closeDetail">
        <div class="detail-panel" @click.stop>
          <button class="lightbox-close detail-close" @click="closeDetail" aria-label="Close">✕</button>

          <div class="detail-media" v-if="detail.person.photo">
            <img :src="detail.person.photo" :alt="detail.person.name" class="detail-photo" />
          </div>

          <div class="detail-info">
            <div class="detail-name">{{ detail.person.name }}</div>
            <div class="detail-role" v-if="detail.person.role">{{ detail.person.role }}</div>

            <div class="detail-tag-row" v-if="detail.person.tags && detail.person.tags.length">
              <span class="member-tag" v-for="t in detail.person.tags" :key="t">{{ t }}</span>
            </div>

            <p class="detail-body" v-if="detail.person.interest">{{ detail.person.interest }}</p>
            <p class="detail-hobby" v-if="detail.person.hobby">Hobby: {{ detail.person.hobby }}</p>
          </div>
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

      // ✅ 图片放大预览
      lightbox: {
        open: false,
        src: "",
        alt: ""
      },

      /* ✅ 研究方向详情弹层 */
      detail: {
        open: false,
        person: null
      },

      sections: [
        { key: "pi", label: "Principal Investigator", nav: "PI" },
        { key: "postdoc", label: "Postdoctoral Fellow", nav: "Postdoc" },
        { key: "rscientist", label: "Research Scientist", nav: "Scientist" },
        { key: "rassistant", label: "Research Assistant", nav: "Assistant" },
        { key: "phd", label: "PhD Student", nav: "PhD" },
        { key: "master", label: "Master Student", nav: "Master" },
        { key: "undergrad", label: "Undergraduate", nav: "Undergrad" },
        { key: "visiting", label: "Visiting", nav: "Visiting" },
        { key: "alumni", label: "Alumni", nav: "Alumni" }
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
          name: "Haibin He",
          role: "Research Assistant",
          tags: ["scRNA Multi-omics", "Precision Medicine", "GWAS"],
          email: "hehb@wchscu.cn",
          interest: "Integrating population genetics and single-cell multi-omics to interpret genetic variants, identify disease-relevant cell types, and develop computational methods for precision medicine.",
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
          name: "Hongcen Jiang",
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
          tags: ["Multi-omics", "GWAS", "Method Development"],
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
          interest: "GWAS and multi-omics integration to investigate the genetic architecture underlying complex diseases.",
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
          email: "hanbingwang0724@163.com",
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
    window.addEventListener("scroll", this.onScroll, { passive: true });
  },

  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
    window.removeEventListener("keydown", this.onKeydown);
    window.removeEventListener("scroll", this.onScroll);
  },

  computed: {
    counts() {
      return {
        pi: 1,
        postdoc: this.postdocs.length,
        rscientist: this.rscientist.length,
        rassistant: this.rassistant.length,
        phd: this.phd.length,
        master: this.master.length,
        undergrad: this.undergrad.length,
        visiting: this.visiting.length,
        alumni: this.alumni.length
      };
    }
  },

  methods: {
    mailto(email) {
      const e = (email || "").toString().trim();
      return e ? `mailto:${e}` : "#";
    },
    /* 取研究方向第一句（卡片一句话简介） */

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
      if (e.key !== "Escape") return;
      if (this.lightbox.open) this.closeImage();
      else if (this.detail.open) this.closeDetail();
    },

    onScroll() {
      const doc = document.documentElement;
      if (window.innerHeight + window.pageYOffset >= doc.scrollHeight - 8) {
        this.activeSection = this.sections[this.sections.length - 1].key;
      }
    },

    scrollToSection(key) {
      const el = document.getElementById(`sec-${key}`);
      if (!el) return;

      this.activeSection = key;
      this.scrollActiveChip();

      const isMobile = window.innerWidth <= 768;
      const offset = isMobile ? 152 : this.scrollOffset;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
    },

    /* ✅ 研究方向详情弹层 */
    openDetail(p) {
      if (!p) return;
      this.detail.open = true;
      this.detail.person = p;
      document.body.style.overflow = "hidden";
    },

    closeDetail() {
      this.detail.open = false;
      this.detail.person = null;
      document.body.style.overflow = "";
    },

    /* ✅ 移动端：把当前 chip 滚到可视区中间 */
    scrollActiveChip() {      if (window.innerWidth > 768 || !this.$el || !this.$el.querySelector) return;
      const bar = this.$el.querySelector(".year-sidebar");
      const chip = bar && bar.querySelector(".year-link.active");
      if (!bar || !chip) return;

      const target = chip.offsetLeft - (bar.clientWidth - chip.offsetWidth) / 2;
      if (Math.abs(bar.scrollLeft - target) < 4) return;
      bar.scrollTo({ left: Math.max(target, 0), behavior: "smooth" });
    },

    initObserver() {
      if (typeof IntersectionObserver === "undefined") return;

      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const key = entry.target.dataset.key;
              if (key && key !== this.activeSection) {
                this.activeSection = key;
                this.scrollActiveChip();
              }
            }
          });
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
      );

      this.$nextTick(() => {
        const root = this.$el;
        if (!root || !root.querySelectorAll) return;
        root.querySelectorAll(".section-block[data-key]").forEach(el => this.observer.observe(el));
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

/* ✅ 左侧导航栏：吸顶 + 人数 + 当前项竖条 */
.year-sidebar {
  width: 142px;
  margin-right: 22px;
  margin-left: -20px;   /* ✅ 往左移：-10/-20/-30 自己调 */
  position: sticky;

  /* ✅ 吸顶：紧贴固定 header（72px）下方 */
  top: 100px;

  align-self: flex-start;
  text-align: left;
  padding: 2px 0;
  z-index: 5;
}

.year-link {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  font-size: 14px;
  font-weight: 600;
  color: #8b97a5;
  cursor: pointer;
  padding: 8px 9px 8px 13px;
  border-radius: 10px;
  margin-bottom: 2px;
  transition: color 0.15s ease, background 0.15s ease;
  white-space: nowrap;
  text-align: left;
  user-select: none;
}

/* 当前项左侧竖条 */
.year-link::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 3px;
  height: 0;
  transform: translateY(-50%);
  border-radius: 3px;
  background: #2f5d8a;
  transition: height 0.18s ease;
}

.year-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.year-count {
  margin-left: auto;
  flex: 0 0 auto;
  min-width: 20px;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(47, 93, 138, 0.06);
  color: #93a1b1;
  font-size: 11.5px;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
  transition: color 0.15s ease, background 0.15s ease;
}

.year-link:hover {
  color: #2f5d8a;
  background: rgba(47, 93, 138, 0.06);
}

.year-link.active {
  color: #2f5d8a;
  background: #eef4fb;
  font-weight: 800;
}

.year-link.active::before {
  height: 18px;
}

.year-link.active .year-count {
  color: #2f5d8a;
  background: rgba(47, 93, 138, 0.14);
}

.year-link:focus-visible {
  outline: 2px solid rgba(47, 93, 138, 0.45);
  outline-offset: 2px;
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
  /* ✅ 一行 3 列，正好铺满内容区 */
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 30px;
  grid-auto-rows: 1fr;   /* ✅ 同组卡片等高 */
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
  --piH: 290px;
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
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.member-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadowHover);
}

.member-photo {
  width: 100%;
  padding: 14px 0 6px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.photo-oval {
  /* ✅ 照片随卡片宽度等比放大（4:5），最多 240px 宽 */
  width: min(212px, calc(100% - 24px));
  aspect-ratio: 4 / 5;
  height: auto;
  border-radius: 20px;
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
  padding: 16px 18px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  text-align: left;
  flex: 1 1 auto;   /* ✅ 撑满卡片剩余高度 */
}

/* ✅ 姓名：左对齐、字号加大 */
.member-name {
  font-size: 21px;
  font-weight: 800;
  color: var(--accent);
  line-height: 1.25;
  letter-spacing: -0.01em;
  text-align: left;
}

/* ✅ 姓名下的短分隔线 */
.member-divider {
  display: block;
  width: 56px;
  height: 1px;
  background: #dde7f2;
  margin: 1px 0 1px;
}

/* ✅ 邮箱块：左对齐 */
.member-lines {
  width: 100%;
  display: block;
  margin-top: 2px;
}
.member-lines .contact-row {
  gap: 9px;
  justify-content: flex-start;
  align-items: center;   /* ✅ 邮箱换成两行时，图标垂直居中 */
}
.member-lines .contact-icon,
.member-lines .icon-sm {
  width: 17px;
  height: 17px;
}
.member-lines .icon-sm {
  stroke: #aebbc9;
  stroke-width: 1.6;
}
.member-lines .email-link {
  font-size: 15px;
  line-height: 1.5;
  color: #8b97a5;
  text-decoration: none;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.member-lines .email-link:hover {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-decoration-color: rgba(47, 93, 138, 0.45);
  text-underline-offset: 3px;
}

/* ✅ 小字补充：研究方向 / 标签 / 爱好 */
.member-extra {
  flex: 1 1 auto;   /* ✅ 吸收高度差，保证 hobby 底部对齐 */
  margin-top: 3px;
  padding-top: 9px;
  border-top: 1px dashed rgba(47, 93, 138, 0.14);
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.member-interest {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: #7f8c9b;
  text-align: left;
  word-break: break-word;
  overflow-wrap: anywhere;
  /* ✅ 超过 2 行用 … 截断，点击看全文 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
  transition: color 0.15s ease;
}

.member-interest:hover {
  color: var(--accent);
}

.member-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;   /* ✅ 标签向两端分布 */
  gap: 5px;
  margin-top: 1px;
}

.member-tag {
  flex: 1 1 auto;   /* ✅ 两个标签时向两端撑满，单个时占满整行居中 */
  max-width: 100%;
  padding: 1px 7px;
  border-radius: 999px;
  border: 1px solid #e6eef8;
  background: #f5f9fe;
  color: #7d8b9b;
  font-size: 10.5px;
  line-height: 1.6;
  text-align: center;
  white-space: normal;
}

.member-hobby {
  margin: auto 0 0;   /* ✅ 撑到卡片底部，保持同行对齐 */
  font-size: 10.5px;
  line-height: 1.5;
  color: #9aa6b3;
  text-align: left;
  word-break: break-word;
  /* ✅ 只显示一行，超出用 … 截断，点击看全文 */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
  transition: color 0.15s ease;
}

.member-hobby:hover {
  color: var(--accent);
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


/* ✅ 研究方向详情弹层 */
.detail-modal {
  position: fixed;
  inset: 0;
  z-index: 3200;
  padding: 20px;
  background: rgba(11, 34, 58, 0.42);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-panel {
  position: relative;
  width: min(720px, 92vw);
  max-height: 88vh;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: #fff;
  box-shadow: 0 20px 60px rgba(15, 60, 120, 0.22);
}

/* ✅ 详情里的照片：比卡片里更大 */
.detail-media {
  flex: 0 0 auto;
}

.detail-photo {
  display: block;
  width: 230px;
  aspect-ratio: 4 / 5;
  object-fit: contain;
  object-position: center;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: #fff;
}

.detail-info {
  flex: 1 1 auto;
  min-width: 0;
  padding-top: 2px;
}

.detail-close {
  top: 12px;
  right: 12px;
}

.detail-name {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--accent);
}

.detail-role {
  margin-top: 4px;
  font-size: 12.5px;
  font-weight: 600;
  color: #8c98a6;
}

.detail-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 14px;
}

/* 弹层里的标签保持自然宽度 */
.detail-tag-row .member-tag {
  flex: 0 0 auto;
}

.detail-body {
  margin: 14px 0 0;
  font-size: 13.5px;
  line-height: 1.75;
  color: #5b6b7c;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.detail-hobby {
  margin: 12px 0 0;
  font-size: 12px;
  color: #9aa6b3;
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
@media (max-width: 1240px) {
  /* 窄屏时不再负边距，避免导航贴死屏幕边缘 */
  .year-sidebar {
    margin-left: 0;
  }
}

@media (max-width: 1024px) {
  .people-grid.three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  /* ✅ 移动端：左侧导航变成吸顶横向 chips */
  .people-shell {
    box-sizing: border-box;
  }

  .people-container {
    flex-direction: column;
  }

  .year-sidebar {
    display: flex;
    gap: 8px;
    width: auto;
    min-width: 0;
    max-width: 100%;
    align-self: stretch;
    margin: 0 -20px 14px;
    padding: 10px 20px;
    position: sticky;
    top: 72px;
    z-index: 40;
    overflow-x: auto;
    overflow-y: hidden;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid #e8eef7;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .year-sidebar::-webkit-scrollbar {
    display: none;
  }

  .year-link {
    flex: 0 0 auto;
    margin-bottom: 0;
    padding: 7px 12px;
    border: 1px solid #e3ebf5;
    border-radius: 999px;
    background: #fff;
    font-size: 13.5px;
    color: #6f7c8c;
    box-shadow: 0 2px 6px rgba(15, 60, 120, 0.05);
  }
  .year-link::before {
    display: none;
  }
  .year-link.active {
    background: #2f5d8a;
    border-color: #2f5d8a;
    color: #fff;
    font-weight: 700;
  }
  .year-link.active .year-count {
    background: rgba(255, 255, 255, 0.22);
    color: #fff;
  }

  .people-content-board {
    padding: 22px 18px;
    min-width: 0;
    width: auto;
    max-width: 100%;
    box-sizing: border-box;
  }

  /* ✅ 详情弹层在手机上改为上下排布 */
  .detail-panel {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }
  .detail-media {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .detail-photo {
    width: 62%;
  }
  .people-grid.three {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;   /* 单列时不再强行等高 */
  }

  .pi-card {
    flex-direction: column;
    align-items: center;
  }
  .pi-photo {
    order: -1;
    --piH: 300px;
    height: var(--piH);
    width: calc(var(--piH) * 0.66);
  }
}
</style>