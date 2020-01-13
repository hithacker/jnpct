select create_db_user('setco', 'password');

INSERT into organisation (name, db_user, uuid, parent_organisation_id)
values ('Setco',
        'setco', 'b3198ab7-ff6a-4924-8316-460aae0d377d', null);
